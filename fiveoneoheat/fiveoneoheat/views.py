__author__ = 'claygraham'

from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from fiveoneoheat.util.dataloader import DataLoader
import json
from django.http import HttpResponse,Http404



def index(request,
          template_name="index.html"):
    return render_to_response(template_name, {
    }, context_instance=RequestContext(request))


def search_name(request,
                template_name="search_name.html"):
    return render_to_response(template_name, {
    }, context_instance=RequestContext(request))


def search_name_json(request):

    load = DataLoader()

    #lat "lon": -122.26691648086924, "address": "2214 BROADWAY OAKLAND CA", "lat": 37.811080264089874
    lat = 37.811080264089874,
    lng = -122.26691648086924
    if request.GET.get('lat',None):
        lat = float(request.GET.get('lat',None))
    if request.GET.get('lng',None):
        lng = float(request.GET.get('lng',None))

    r = '100km'
    if request.GET.get('r',None):
        r = request.GET.get('r',None)

    results = load.query_term_geo(request.GET['name'],lat,lng,r,'inspection','facility')
    records = []
    for index_record in results:
        records.append(index_record)

    return HttpResponse(json.dumps(records),'application/json')


def map_browse(request,
               template_name="map_browse.html"):
    return render_to_response(template_name, {
    }, context_instance=RequestContext(request))


def map_browse_json(request):

    load = DataLoader()

    #lat "lon": -122.26691648086924, "address": "2214 BROADWAY OAKLAND CA", "lat": 37.811080264089874
    lat = 37.811080264089874,
    lng = -122.26691648086924
    if request.GET.get('lat',None):
        lat = float(request.GET.get('lat',None))
    if request.GET.get('lng',None):
        lng = float(request.GET.get('lng',None))

    r = '5km'
    if request.GET.get('r',None):
        r = request.GET.get('r',None)

    term = None
    if request.GET.get('term',None):
        term = request.GET.get('term',None)

    if term:
        results = load.query_term_geo(term,lat,lng,r,'inspection','facility')
    else:
        results = load.query_geo(lat,lng,r,'inspection','facility')

    records = []
    for index_record in results:
        records.append(index_record)

    return HttpResponse(json.dumps(records),'application/json')

#def facility(request):
#    if not request.GET.get('id',None):
#        raise Http404
#    loader = DataLoader()
#
#    facility = loader.query_by_id(request.GET.get('id',None),'inspection','facility')
#    if facility:
#        return render_to_response('facility.html', { 'facility':facility
#        }, context_instance=RequestContext(request))
#    else:
#        raise Http404

def facility_by_id(request, facility_id):
    if not facility_id:
        raise Http404
    loader = DataLoader()

    facility = loader.query_by_id(facility_id,'inspection','facility')
    print facility

    if facility:
        return render_to_response('facility.html', { 'facility':facility
        }, context_instance=RequestContext(request))
    else:
        raise Http404

