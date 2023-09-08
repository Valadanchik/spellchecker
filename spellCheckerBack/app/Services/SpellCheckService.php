<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;

class SpellCheckService
{
    public function checkSpell($words,$lang)
    {
    $client = new Client();
    try {
        $response = $client->post('http://35.197.120.214:5000/api/v1/spell', [
            'form_params' => [
                'text' => implode(' ',$words),
                'lang' => $lang,
            ],
        ]);
        $statusCode = $response->getStatusCode();
        $data =  json_decode($response->getBody(), true); // Parse JSON response
        return $this->format($data);
    } catch (GuzzleHttp\Exception\RequestException $e) {
        $statusCode = $e->getResponse()->getStatusCode();
        $errorResponse = json_decode($e->getResponse()->getBody(), true);
    }
    }

    private  function format($spellErrors){
     $newArr =[];
       foreach($spellErrors as $error){
            $newArr[$error['original']]=$error['suggestions'];
       }
       return $newArr;
    }
}
