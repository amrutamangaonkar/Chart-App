var app = angular.module("d3Test", ['d3Test.directives']);

app.controller('IndicatorsCtrl', function($scope) {
   // $scope.datas = Indicators.query();
	$scope.graphdata1=[];
	$scope.colorCode=[];
	var width=screen.width*0.95;
	var height=screen.height*0.5;
	$scope.sheight=screen.height*0.7;
	
	var widthNumber=parseInt(width);
	var heightNumber=parseInt(height);
	$scope.graphwidth=widthNumber;
	$scope.graphheight=heightNumber;
	var regionCounter=1;
	var classobj=angular.element(document.querySelector('#graphelement') );
	$scope.colorCode=["#7cb5ec","#f7a35c","#a9ff96","#8085e9","#808080"];
	
			$scope.doClick = function() { 
				  var txtName=(angular.element( document.querySelector('#txtName') )).val();//enter string
				  var txtValue=(angular.element( document.querySelector('#txtValue') )).val();//enter integer
				   if(txtName==null || txtName==null ||txtName=="" ||txtName=="")
				   {
				    alert("Please do not leave the fields empty");
				    return false;
				   }else if(isNaN(txtValue)){
					alert("Please enter a number");
				   }
				   else
				   {
				        record = {}
				        record ["label"] = txtName;
				        record ["pieValue"] = txtValue;
				    $scope.graphdata1.push(record);
				     (angular.element( document.querySelector('#txtName') )).val("");
				     (angular.element( document.querySelector('#txtValue') )).val(""); 

				   }
				  } 

	$scope.generateGraphWithData = function() {
		if($scope.graphdata1==null || $scope.graphdata1=="")
	    {
	      alert("Please enter some value");
	      return false;
	    }

		$scope.graphdata=[];
		$scope.graphdata1.forEach(function(entry) {
		$scope.graphdata.push(entry);
	   });
	}
	
	
});

angular.module('d3Test.directives', []).
	directive('graph', function () {
		return {
			restrict: 'E',
			scope: {
				values: '=',
				name: '@',
				slice:'@',
				slicecolor: '=',
				widthgraph: '=',
				heightgraph: '=',
				svgheight: '='
			},
			link: function (scope, element, attrs) {
				
				scope.$watch('values', function(values) {
					if(values) {  
						var radius = Math.min(scope.widthgraph,scope.heightgraph) / 2;
						var i=0,j=0,count=0,idnum=0,pat=0,x0,y0;
						
						var radius = Math.min(scope.widthgraph-5,scope.heightgraph-6) / 2;
						var lastIndicator=0,lastCircle=0,lastLabel=0,tickcounter=0,j=0,count=0,idnum=0,pat=0,labelCounter=0,circleCounter=0,spaceDiff,spaceDiffCircle,radiuslength;
						var arrAge=new Array();
						var patternobj=[{patternstr:'M10,0 l-10,10',w:10,h:1},{patternstr:'M-1,1 l2,-2 M0,7 l4,-4 M3,5 l2,-2',w:4,h:4},{patternstr:'M0,0 l25,25',w:25,h:25},{patternstr:'M25,0 l-25,25',w:25,h:25},{patternstr:'M0,0 l25,25 M25,0 l-25,25',w:25,h:25}];

						values.forEach(function(d)
						{  				
							arrAge.push(d[scope.slice]);
						});
							
						var color = d3.scale.ordinal()
							.range(scope.slicecolor);
							
						var arc = d3.svg.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);
						var pie = d3.layout.pie().sort(null)
							.value(function(d) { 
								return d[scope.name]; 
							});
						
						(angular.element(document.querySelector("svg") )).remove();

						var svg = d3.select("body").append("svg")
							.attr("width", scope.widthgraph)
							.attr("height", scope.svgheight)
							.append("g")
							.attr("transform", "translate(" + scope.widthgraph / 2 + "," + scope.svgheight / 2 + ")");
						
						/*remove this if pattern is not required*/
						values.forEach(function()
						{  
						if(pat==5)
						{
							pat=0;
						}
						var tempvar=pat++;
						
						svg.append('defs')
					  .append('pattern')
						.attr('id', "diagonalHatch"+(idnum++))
						.attr('patternUnits', 'userSpaceOnUse')
						.attr('width', patternobj[tempvar].w)
						.attr('height', patternobj[tempvar].h)
					  .append('path')
						.attr('d', patternobj[tempvar].patternstr)
						.attr('stroke', '#000000')
						.attr('stroke-width', 1);
						
						});
						
						
							values.forEach(function(d) {
								d[scope.name] = +d[scope.name];
								
							});
							
							var g = svg.selectAll(".arc")
								.data(pie(values))
								.enter().append("g")
								.attr("class", "arc");
							
							g.append("path")
								.attr("d", arc)
								.style("fill", function(d) { 
								var tempAge=arrAge[i++];
								return color(tempAge); 
								});
							g.append("path")
								.attr("d", arc)
								.attr("fill", function(d)
								{ 
									if(count==5)
								  {
										count=0;
								  }
									return "url(#diagonalHatch"+(count++)+")";
								});
									/*g.append("line")
							.attr("transform", function(d) { 
							circleCounter++;
							lastCircle++;
							if(circleCounter%2==0)
							{		spaceDiffCircle=20;
							}
					           else if(circleCounter%3==0)
					           {
					        	   spaceDiffCircle=33;
					        	   circleCounter=0;
					           }
					           else{
					        	   if(lastCircle%7==0){
										spaceDiffCircle=20;
										lastCircle=0;
									}else{
					        	   spaceDiffCircle=5;
									}
					           }
							
					              var dist=radius+spaceDiffCircle;
					              var winkel=(d.startAngle+d.endAngle)/2;
					              var x=dist*Math.sin(winkel);
					              var y=-dist*Math.cos(winkel);
					              return "translate(" + x + "," + y + ")";
					              
					              })
							 .attr("x1", "0")
							.attr("y1", "0")
							.attr("x2", "20")
							.attr("y2", "0")
							//.style("fill", "#4b535a")
							.style("stroke","rgba(75,83,90,1)");*/
							g.append("text")
								.attr("transform", function(d) { var dist=radius+25;
   var winkel=(d.startAngle+d.endAngle)/2;
   var x=dist*Math.sin(winkel);
   var y=-dist*Math.cos(winkel);
   return "translate(" + x + "," + y + ")";})
								.attr("dy", ".35em")
								.style("text-anchor", "middle")
								.text(function(d) {
									return arrAge[j++]; 
									});
									
									/*var ticks = svg.selectAll("line").data(pie(values)).enter().append("line");
ticks.attr("x1", 0)
.attr("x2", 0)
.attr("y1", -radius+11)
.attr("y2", -radius-2)
.attr("stroke", "gray")
.attr("transform", function(d) {
  return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
});*/
	var ticks = svg.selectAll("line").data(pie(values)).enter().append("line");
	
						ticks.attr("x1", 0)
						.attr("x2", 0)
						.attr("y1", -radius+12)
						.attr("y2", 
								function(d)
								{

							// tickcounter++;
							// lastIndicator++;
							// if(tickcounter%2==0){
								// radiuslength=13;
							// }
							// else if(tickcounter%3==0){
								// radiuslength=28;
								// tickcounter=0;
							// }
							// else{
								// if(lastIndicator%7==0){
									// radiuslength=19;
									// lastIndicator=0;
								// }else{
									// radiuslength=0.5;
								// }	
							// }
				radiuslength=13;
							return -radius-radiuslength;
								})
								.style("stroke","rgba(75,83,90,1)")
								.attr("transform", function(d) {
									return "rotate(" + (d.startAngle+d.endAngle)/2 * (180/Math.PI) + ")";
								});
								
// var l1=g.append("line");
							// l1.attr("transform", function(d) { 
							// circleCounter++;
							// lastCircle++;
							// if(circleCounter%2==0)
							// {		spaceDiffCircle=13;
							// }
					           // else if(circleCounter%3==0)
					           // {
					        	   // spaceDiffCircle=28;
					        	   // circleCounter=0;
					           // }
					           // else{
					        	   // if(lastCircle%7==0){
										// spaceDiffCircle=19;
										// lastCircle=0;
									// }else{
					        	   // spaceDiffCircle=0.5;
									// }
					           // }
							// spaceDiffCircle=13;
					              // var dist=radius+spaceDiffCircle;
					              // var winkel=(d.startAngle+d.endAngle)/2;
					              // x0=dist*Math.sin(winkel);
					              // y0=-dist*Math.cos(winkel);
					              // return "translate(" + x0 + "," + y0 + ")";
					              
					              // });
								
							 // l1.attr("x1", "0")
							// .attr("y1", "0")
							// .attr("x2", "20")
							// .attr("y2", "0")
							// //.style("fill", "#4b535a")
							// .style("stroke","rgba(75,83,90,1)");
							}
							
				})
			}
		}
	});
	