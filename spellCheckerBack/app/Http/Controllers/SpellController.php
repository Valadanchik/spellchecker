<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddDictionary;
use App\Services\SpellCheckService;
use Illuminate\Http\Request;
class SpellController extends Controller
{
   public function checkSpell(Request $request, SpellCheckService $spell){
    return $spell->checkSpell($request->words,$request->lang);
   }
}
