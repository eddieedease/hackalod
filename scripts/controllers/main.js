'use strict';


angular.module('tannedApp')
  .controller('MainCtrl', function($scope, $http) {

    $scope.debug = "";
    $scope.sgdArray = [];
    $scope.de = false;
    $scope.nav = true;

    $scope.setsubject = function(subj) {
      $scope.de = true;
      $scope.nav = false;
      $scope.titel = subj;
      var queryy = "select * { \n\
       ?s ?p ?o . \n\
       OPTIONAL {  ?s <http://lod.kb.nl/sgd/> rdfs:label . } \n\
       OPTIONAL {  ?s <http://lod.kb.nl/sgd/startDate> ?dateStart . } \n\
       OPTIONAL {  ?s <http://lod.kb.nl/sgd/endDate> ?dateEnd . } \n\
       OPTIONAL {  ?s <http://lod.kb.nl/sgd/dateQuestion> ?dateQ . } \n\
       OPTIONAL {  ?s <http://lod.kb.nl/sgd/dateResponse> ?dateR . } \n\
       FILTER(bif:contains(?o,'" + subj + "'))\n\
     } LIMIT 100";

      // NOTE Setting up the thingies for querying with SPARQL
      $http({
          //url: 'http://landregistry.data.gov.uk/landregistry/query',
          url: 'http://lod.kb.nl/sparql/',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/sparql-results+json'
          },
          method: "GET",
          params: {
            query: queryy,
            format: "json"
          }
        })
        .success(function(data, status, headers, config) {
          $scope.results = data.results.bindings;
          //console.log($scope.results);
          for (var key in $scope.results) {
            if ($scope.results[key].dateQ)
              var res = $scope.results[key].dateQ.value.substring(0, 4);
            var obj = {
              author: $scope.results[key].o.value,
              datum: res,
              source: Math.floor(Math.random() * 3) + 0,
              link: $scope.results[key].s.value
            };
            $scope.sgdArray.push(obj);
          }

          console.log($scope.sgdArray);
          $scope.check();

        })

      .error(function(data, status, headers, config) {

      });
    }
    $scope.check = function() {
      var w = parseInt(d3.select("#graph").style("width")),
        h = parseInt(d3.select("#graph").style("height"));
      var svg = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);
      //Set up tooltip

      var data = [{
        "datum": 1990,
        "source": 0,
        "author": "test1",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1965,
        "source": 1,
        "author": "test2",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1970,
        "source": 2,
        "author": "test3",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1962,
        "source": 1,
        "author": "test4",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1951,
        "source": 2,
        "author": "test5",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1990,
        "source": 0,
        "author": "test6",
        "link": "http://www.tannevanbree.nl"
      }, {
        "datum": 1970,
        "source": 1,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 1,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 1,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 3,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 1,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 1,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 2,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1970,
        "source": 2,
        "author": "test7",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1965,
        "source": 3,
        "author": "test8",
        "link": "http://www.edease.nl"
      }, {
        "datum": 1990,
        "source": 1,
        "author": "test9",
        "link": "http://www.edease.nl"
      }, ];
      //source bijv 0 krant, 1 tijdschrift, 2 politiek, 3 journaal
      var datumOb = $scope.sgdArray.map(function(obj) {
        return obj.datum;
      });
      var past = Math.min.apply(null, datumOb);
      var present = Math.max.apply(null, datumOb);
      //console.log(past + " " + present);
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      var unique = datumOb.filter(onlyUnique);
      //console.log(unique);

      $scope.sgdArray.sort(function(a, b) {
        return a.datum - b.datum;
      });

      var width = w,
        height = h,
        padding = 6, // separation between nodes
        maxRadius = 12;

      var n = d3.sum($scope.sgdArray), // total number of nodes
        m = unique.length; // number of distinct clusters

      console.log(n + "   " + m);

      var color = [];
      for (var c = 0; c < 4; c++) {
        color[c] = d3.rgb(Math.random() * 100, Math.random() * 255, Math.random() * 255);
      }

      var x = d3.scale.ordinal()
        .domain(d3.range(m))
        .rangePoints([0, width], 1);

      unique.sort();

      var nodes = [];
      var increment = 0;
      //Add the SVG Text Element to the svgContainer
      var text = svg.selectAll("text")
        .data(unique)
        .enter()
        .append("text");

      var textLabels = text
        .attr("x", function(d, i) {
          return x(i) - 25;
        })
        .attr("y", height / 2)
        .text(function(d, i) {
          return unique[i];
        });

      for (var j = 0; j < $scope.sgdArray.length; j++) {
        if (j == 0) {
          nodes[j] = {
            author: $scope.sgdArray[j].author,
            radius: maxRadius,
            color: color[$scope.sgdArray[j].source],
            cx: x(increment),
            cy: height / 4,
            link: $scope.sgdArray[j].link
          };
        } else if ($scope.sgdArray[j].datum != $scope.sgdArray[j - 1].datum) {
          increment++;
          nodes[j] = {
            author: $scope.sgdArray[j].author,
            radius: maxRadius,
            color: color[$scope.sgdArray[j].source],
            cx: x(increment),
            cy: height / 4,
            link: $scope.sgdArray[j].link
          };

        } else {
          nodes[j] = {
            author: $scope.sgdArray[j].author,
            radius: maxRadius,
            color: color[$scope.sgdArray[j].source],
            cx: x(increment),
            cy: height / 4,
            link: $scope.sgdArray[j].link
          };
        }
      }



      var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(0)
        .charge(0)
        .on("tick", tick)
        .start();

      var circle = svg.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", function(d) {
          return d.radius;
        })
        .style("fill", function(d) {
          return d.color;
        })
        .on('click', function(d) {
          window.open(d.link, '_blank');
        })
        .call(force.drag);

      /*circle.append("text")
        .text(function(d) {
          //console.log(d.author);
          return d.author;
        })
        .style("font-size", 12)
        .attr("x", "15px")
      ;*/

      function tick(e) {
        circle
          .each(gravity(.1 * e.alpha))
          .each(collide(.5))
          .attr("cx", function(d) {
            return d.x;
          })
          .attr("cy", function(d) {
            return d.y;
          });
      }

      // Move nodes toward cluster focus.
      function gravity(alpha) {
        return function(d) {
          d.y += (d.cy - d.y) * alpha;
          d.x += (d.cx - d.x) * alpha;
        };
      }

      // Resolve collisions between nodes.
      function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
          var r = d.radius + maxRadius + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }
    }
  });
