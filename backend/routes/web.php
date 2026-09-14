<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'ANUBIS Travel Tours API & Admin Engine',
        'status' => 'operational',
        'admin_panel' => url('/admin'),
        'docs' => url('/api/health'),
    ]);
});
