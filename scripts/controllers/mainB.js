'use strict';


angular.module('tannedApp')
  .controller('MainCtrl', function($scope, $http) {
    $scope.debug = "";

    var parseXml;

    if (typeof window.DOMParser != "undefined") {
      parseXml = function(xmlStr) {
        return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
      };
    } else if (typeof window.ActiveXObject != "undefined" &&
      new window.ActiveXObject("Microsoft.XMLDOM")) {
      parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
      };
    } else {
      throw new Error("No XML parser found");
    }


    $scope.xmlxml = parseXml('<query xmlns="http://openlinksw.com/services/facets/1.0" inference="" same-as=""><text>Vluchteling</text><view type="text" limit="20" offset=""/></query>');
    //alert($scope.xmlxml.documentElement.nodeName);
    // NOTE Setting up the thingies for querying with SPARQL

    $http({
        method: 'POST',
        url: 'http://lod.kb.nl/fct/service',
        data: $scope.xmlxml,
        headers: {'Content-Type': 'text/xml'}
      })
      .success(function(data, status, headers, config) {
        //console.log(data.results);
      })
      .error(function(data, status, headers, config) {

      });

    $scope.queryW = function() {
      console.log("check");
    };

  });
