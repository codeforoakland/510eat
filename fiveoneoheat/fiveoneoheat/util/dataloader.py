__author__ = 'cgraham'
import json
import csv, sys
import uuid
import re
import time
from datetime import timedelta
import hashlib
from isounidecode import unidecode
from pyes import *

class DataLoader():

    def slugify(self,str):
        new_str = unidecode(str).lower()
        return re.sub(r'\W+','-',new_str)

    def searchify(self,str):
        new_str = unidecode(str).lower().replace("'","")
        return re.sub(r'\W+',' ',new_str)


    def clean_place_data(self):

        search_field = 'facility_name'

        fields = [['facility_name','STRING'],
                  ['activity_date','STRING'],
                  ['service','STRING'],
                  ['violation_description','STRING'],
                  ['grade','STRING'],
                  ['address','STRING']]

        infile = '/Users/claygraham/data/github/510eat/fiveoneoheat/static/data/alameda_county_restaurants_inspections_n.csv'
        f = open(infile, 'U')

        outfile  = '/Users/claygraham/data/github/510eat/fiveoneoheat/static/data/alameda_county_restaurants_inspections_cleaned.json'
        fout = open(outfile, 'w')

        #for each row in the csv
        csv.field_size_limit(sys.maxint)
        with f as csvfile:
            reader = csv.reader(csvfile, delimiter=',', quotechar='"')

            #for each field
            for row in reader:
                record = {  }
                index=0
                for field in fields:
                    try:
                        #index = fields.index(field)
                        if(field[1]=='INT'):
                            record[field[0]] = int(row[index])
                        elif (field[1]=='STRING'):
                            record[field[0]] = row[index].replace('\n',' ')
                        elif (field[1]=='FLOAT'):
                            record[field[0]] = float(row[index])
                        index = index +1
                    except:
                        pass


                location_all = record['address']\
                .replace(",","").replace("(","|").replace(")","")
                #print location_all
                location_tokens = location_all.split("|")
                if len(location_tokens)>1 and record['grade']:
                    location_latlng = location_tokens[1].split(" ")
                    record['address'] = location_tokens[0][:-1]
                    record['lat'] = float(location_latlng[0])
                    record['lon'] = float(location_latlng[1])

                    inspection_date = {
                        'activity_date':record['activity_date'],
                        'violation_descriptions':[record['violation_description']],
                        'grade':record['grade']
                    }

                    record['inspections'] = [inspection_date]
                    del record['violation_description']
                    del record['activity_date']
                    del record['grade']

                    slug_all = '{0}-{1}'.format(
                        self.slugify(record[search_field]),
                        self.slugify(record['address']))

                    record_id = hashlib.md5(slug_all).hexdigest()[:8]

                    index_record = {
                        'id': record_id,
                        'search': self.searchify(record[search_field]).strip(),
                        'location':{ 'lat':record['lat'], 'lon':record['lon']},
                        'document':record
                    }

                    if record_id == '5c67d2b7':
                        print index_record

                    dumps = json.dumps(index_record)
                    #print dumps
                    print>>fout,dumps

            fout.close()

    def load_inspections(self):
        infile = '/Users/claygraham/data/github/510eat/fiveoneoheat/static/data/alameda_county_restaurants_inspections_cleaned.json'
        #load_index_json(self, infile, index_id, mapping_id, mapping=None, delete_index=True)
        self.load_index_json(
            infile=infile,
            index_id='inspection',
            mapping_id='facility',
            mapping=None,
            delete_index=True)

    def query_by_id(self, id, index_id, mapping_id):
        conn = ES('127.0.0.1:9200') # Use HTTP
        item = None
        try :
            item = conn.get(index_id, mapping_id, id)
        except Exception as e:
            print 'CANNOT FIND ITEM WITH ID:{0}'.format(id)

        return item


    def query_geo(self, lat, lon, distance, index_id, mapping_id):
        conn = ES('127.0.0.1:9200') # Use HTTP

        q= {
            "filtered" : {
                "query" : {
                    "match_all":{}
                },
                "filter" : {
                    "geo_distance" : {
                        "distance" : distance,
                        "location" : {
                            "lat": lat, "lon": lon
                        }
                    }
                }
            }
        }
        results = conn.search(query = q, indices=[index_id], doc_types=[mapping_id])
        return results

    def query_term_geo(self, term, lat, lon, distance, index_id, mapping_id):
        conn = ES('127.0.0.1:9200') # Use HTTP

        q= {
            "filtered" : {
                "query" : {
                    "match" : {
                        "search" : { "query" : self.searchify(term), "type" : "phrase" }
                    }
                },
                "filter" : {
                    "geo_distance" : {
                        "distance" : distance,
                        "location" : {
                            "lat": lat, "lon": lon
                        }
                    }
                }
            }
        }
        results = conn.search(query = q, indices=[index_id], doc_types=[mapping_id])
        return results

    def query_term(self, term, index_id):
        conn = ES('127.0.0.1:9200') # Use HTTP

        q= {
            "filtered" : {
                "query" : {
                    "match" : {
                        "search" : { "query" : self.searchify(term), "type" : "phrase" }
                    }
                },
                "filter" : {
                    "script": {
                        "script": "_source.search == \"{0}\"".format(self.searchify(term))
                    }
                }
            }
        }

        result = conn.search(query=q, indices=[index_id])
        result_model = []
        for index_record in result:
            result_model.append(index_record['document'])

        return result_model

    def query_term_field(self, field, term, index_id):
        conn = ES('127.0.0.1:9200') # Use HTTP

        q= {
            "filtered" : {
                "query" : {
                    "match" : {
                        field : { "query" : self.searchify(term), "type" : "phrase" }
                    }
                },
                "filter" : {
                    "script": {
                        "script": "_source.{0} == '{1}'".format(field,self.searchify(term))
                    }
                }
            }
        }

        result = conn.search(query=q, indices=[index_id])
        result_model = []
        for index_record in result:
            result_model.append(index_record['document'])

        return result_model

    def load_index_json(self, infile, index_id, mapping_id, mapping=None, delete_index=True):

        #delete the index if exists
        conn = ES('127.0.0.1:9200') # Use HTTP
        try:
            if delete_index:
                conn.indices.delete_index(index_id)

        except:
            print 'cannot delete index with id: {0}'.format(index_id)
            pass

        if delete_index:
            print 'DELETING INDEX {0}'.format(index_id)
            conn.indices.create_index(index_id)

        #set the mapping
        if mapping == None:
            mapping = {
                'location':{
                    'type':'geo_point'
                },
                'search':{
                    'type':'string',
                    'store':'yes'
                }
            }

        conn.indices.put_mapping(mapping_id, { 'properties': mapping }, [index_id])

        '''
        will make one json file with uuid  for each record
        '''
        f = open(infile, 'r')
        for inspection_line in f:
            inspection = json.loads(inspection_line)

            #try to look it up in the index
            try :
                item = conn.get(index_id, mapping_id, inspection['id'])
                #10/31/2012

                orig_len = len(item['document']['inspections'])
                found = False
                for inspection_store_index in range(orig_len):

                    inspection_store = item['document']['inspections'][inspection_store_index]

                    if inspection_store['activity_date']==inspection['document']['inspections'][0]['activity_date']:
                        inspection_store['violation_descriptions'].append(inspection['document']['inspections'][0]['violation_descriptions'][0])
                        inspection_store['violation_descriptions'] = list(set(inspection_store['violation_descriptions']))
                        item['document']['inspections'][inspection_store_index] = inspection_store
                        found = True

                if not found:
                    print 'adding new inspection for {0} - {1}'.format(
                        item['id'],json.dumps(inspection['document']['inspections']))
                    item['document']['inspections'].extend(inspection['document']['inspections'])

                conn.index(item, index_id, mapping_id, item['id'])


            except Exception as e:
                conn.index(inspection, index_id, mapping_id, inspection['id'])


    def txt2json(self, infile, fields, out_dir):
        '''
        will make one json file with uuid  for each record
        '''
        f = open(infile, 'U')

        #for each row in the csv
        with f as csvfile:
            reader = csv.reader(csvfile, delimiter='\t', quotechar='"')

            #for each field
            for row in reader:

                ids = str(uuid.uuid4()).split('-')
                record_id=ids[0]
                record = { 'id': ids[0] }
                index = 0
                #iterate through the fields in an ordered way
                for field in fields:
                    #index = fields.index(field)
                    if(field[1]=='INT'):
                        record[field[0]] = int(row[index])
                    elif (field[1]=='STRING'):
                        record[field[0]] = row[index]
                    elif (field[1]=='FLOAT'):
                        record[field[0]] = float(row[index])
                    index = index +1;

                print json.dumps(record)
                ids = str(uuid.uuid4()).split('-')
                w = open(out_dir+'/'+record_id+'.json', 'w')
                w.write(json.dumps(record))
                w.close

        print 'done'
