<?php

/*
 * Created on Jul 21, 2012
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */

		function get_results($query, $street_name){
			$json = do_curl_get_https("https://data.acgov.org/api/views/3d5b-2rnz/rows.json?search="."$query"."&max_rows=25", $headers, $returnxfer = true);
			$result_data = json_decode($json); 
			//print_r($result_data);
			$result = array();
			foreach ( $result_data->data as $row ) {
			
				$row_decoded = json_decode($row[12][0]);
				$search = sprintf("/%s/i",$street_name);
				
				$matched = preg_match($search, $row_decoded->address);
				
				//$matched = preg_match("/niles/i", $row[12][0]);
				
				if($matched){
					//print_r($row_decoded->address);
					$result_line = array($row[11],$row[9],$row_decoded);
					array_push($result,$result_line);
				}
				//{
					//print_r($row_decoded);
					//$result_line = array($row[8],$row[11]);
					//array_push($result,$result_line);
				//}
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
?>
