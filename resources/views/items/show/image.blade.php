
@extends('layouts.app')

@section('title', 'Neocortex')

@section('content')

    <div id="main">
        <div class="items">
            <div class="item item__full item__active">
                <div class="item-image" style="background-image: url('{{ $item->details['url'] }}');"></div>
            </div>
        </div>
    </div>

@endsection
