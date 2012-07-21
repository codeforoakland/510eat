<?php
if (!class_exists('FiveOneOhEats')) {
    
    class FiveOneOhEats {   	
    	const VERSON = '1.0';
    	

		
		function get_results($query, $street_name){
			$json = $fiveoneoheats->do_curl_get_https("https://data.acgov.org/api/views/3d5b-2rnz/rows.json?search=burger&max_rows=25", $headers, $returnxfer = true);
			$result_data = json_decode($json); 
			$result = array();
			foreach ( $result_data->data as $row ) {
				if(preg_match('/'.$street_name.'/i', $row[12][0])){
				{
					$result_line = array($row[8],$row[11]);
					array_push($result,$result_line);
				}
			}
			return $result;
		}
		
		function do_curl_get_https($https_url, $headers) {

			//open connection
			$ch = curl_init();
		
			curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
			curl_setopt($ch, CURLOPT_CAINFO, NULL);
			curl_setopt($ch, CURLOPT_CAPATH, NULL);
		
			//set the url, number of POST vars, POST data
			curl_setopt($ch, CURLOPT_URL, $https_url);
			curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		
			//execute post
			$result_json = curl_exec($ch);
		
			curl_close($ch);
			
			return $result_json;
		
		}
    	
		
    }
    	
		
    }
        
    global $fiveoneoheats;
	$fiveoneoheats = new FiveOneOhEats();	
}
?>