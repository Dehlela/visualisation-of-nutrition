var dataPath = "data/chocolates.csv";
d3.csv(dataPath)
    .then(function (myData) {
        // console.log(myData);

        var hover_msg = "Hover over flavours to know more!";

        var chosen_brand = window.location.search.substr(1);
        if (chosen_brand.length === 0) {
            chosen_brand = "Kinder";
        } else if (chosen_brand.includes("%27")) {
            chosen_brand = chosen_brand.replace("%27", "'");
        } else if (chosen_brand.includes("%20")) {
            chosen_brand = chosen_brand.replace("%20", " ");
        }
        //console.log(chosen_brand);
        d3.select("#overall-title #chosen-brand").text(chosen_brand);

        var brand_names = d3.map(myData, function (d) {
            return d.brands_tags;
        }).keys();

        var overall_averages = [];
        var choco_data = [];
        var unit = "g";

        var choco_names = [];
        myData.forEach(function (d) {
            if (d.brands_tags === chosen_brand) {
                //console.log(d.product_name);
                choco_names.push(d.product_name);
            }
        });
        console.log(choco_names[0]);
        var chosen_choco_name = choco_names[0];

        //var data_choice = "nutrition";
        var data_labels = myData.columns.slice(2, 7);

        sync_solo_choco_data(chosen_choco_name);
        d3.select("#overall-labels").selectAll("p")
            .data(data_labels)
            .enter()
            .append("p")
            .attr("class", "normal-text")
            .text(function (d) {
                return d.replace("_100g", "");
            });

        var choco_circles = d3.select("#brand-choices .choco-svg").selectAll("polygon")
            .data(brand_names)
            .enter();
        choco_circles.append("polygon")
            .attr("class", function (d) {
                if (chosen_brand === d) {
                    return "chosen-choco-circle";
                }
            })
            .attr("points", function (d, i) {
                var points_list = "";
                var cx, cy;

                // calculating cy
                if (i < 4) {
                    cy = 30;
                } else if (i < 8) {
                    cy = 110;
                } else {
                    cy = 190;
                }

                // calculating cx
                var index = i;
                index = index % 4;
                cx = (index + 50) + (index * 100);

                // creating points list
                points_list += (cx - 20) + "," + (cy - 5) + " ";
                points_list += (cx - 20) + "," + (cy + 5) + " ";
                points_list += (cx - 10) + "," + (cy) + " ";
                return points_list;
            });
        choco_circles.append("polygon")
            .attr("class", function (d) {
                if (chosen_brand === d) {
                    return "chosen-choco-circle";
                }
            })
            .attr("points", function (d, i) {
                var points_list = "";
                var cx, cy;

                // calculating cy
                if (i < 4) {
                    cy = 30;
                } else if (i < 8) {
                    cy = 110;
                } else {
                    cy = 190;
                }

                // calculating cx
                var index = i;
                index = index % 4;
                cx = (index + 50) + (index * 100);

                points_list += (cx + 20) + "," + (cy - 5) + " ";
                points_list += (cx + 20) + "," + (cy + 5) + " ";
                points_list += (cx + 10) + "," + (cy) + " ";
                return points_list;
            });
        d3.select("#brand-choices .choco-svg").selectAll("circle")
            .data(brand_names)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                if (chosen_brand === d) {
                    return "chosen-choco-circle";
                } else {
                    return "choco-circle";
                }
            })
            .attr("r", "15")
            .attr("cy", function (d, i) {
                if (i < 4) {
                    return 30;
                } else if (i < 8) {
                    return 110;
                }
                return 190;
            })
            .attr("cx", function (d, i) {
                var index = i;
                index = index % 4;
                return (index + 50) + (index * 100);
            })
            .on("mouseenter", function (d) {
                d3.select(this)
                    .style("cursor", "pointer")
                    .transition()
                    .duration(200)
                    .style("stroke-width", "3")
                    .style("stroke", function (d) {
                        if (d !== chosen_brand) {
                            return "url(#grad1)";
                        }
                    });

                console.log(d);
                d3.select("#overall-data").selectAll("svg").remove();
                sync_overall_data(d);
                d3.select("#overall-title #chosen-brand").text(d);

            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("stroke-width", "0");
                d3.select("#overall-data").selectAll("svg").remove();
                sync_overall_data(chosen_brand);
                d3.select("#overall-title #chosen-brand").text(chosen_brand);
            })
            .on("click", function (d) {
                chosen_brand = d;
                console.log(chosen_brand + " clicked.");
                window.location.search = d;
            });

        d3.select("#brand-choices .choco-svg").selectAll("text")
            .data(brand_names)
            .enter()
            .append("text")
            .attr("class", "normal-text")
            .attr("y", function (d, i) {
                if (i < 4) {
                    return 70;
                } else if (i < 8) {
                    return 150;
                }
                return 230;
            })
            .attr("x", function (d, i) {
                var index = i;
                var len = d.length;
                index = index % 4;
                return (index + 50) + (index * 100) - ((len / 2) * 6);
            })
            .text(function (d) {
                return d;
            });
        sync_overall_data(chosen_brand);

        d3.select("#unit-choose-dropdown select")
            .on("change", function () {
                //console.log(newUnit + " selected!");
                unit = d3.select(this).property('value');
                d3.select("#overall-data").selectAll("svg").remove();
                sync_overall_data(chosen_brand);
            });

        // Solo choco section - code referred from http://bl.ocks.org/williaster/10ef968ccfdc71c30ef8#index.html

        var choco_choose = d3.select("#choco-choose-dropdown select")
            .on("change", function () {
                var newChoco = d3.select(this).property('value');
                //console.log(newChoco + " selected!");
                d3.select("#solo-choco-svg").selectAll("rect").remove();
                sync_solo_choco_data(newChoco);
            });
        choco_choose.selectAll("option")
            .data(choco_names)
            .enter()
            .append("option")
            .attr("value", function (d) {
                return d;
            })
            .style("text-transform", "capitalize")
            .text(function (d) {
                return d;
            });


        function sync_solo_choco_data(chosen_choco) {
            var data = [];
            myData.forEach(function (d) {
                if (d.product_name === chosen_choco) {
                    data_labels.forEach(function (labelname) {
                        data.push(d[labelname]);
                    })
                }
            });
            //console.log(data);
            var extent = d3.extent(data, function (d) {
                return parseFloat(d);
            });
            //console.log(extent);
            var chocomin = 0, chocomax = 31;
            var choco_scale = d3.scaleLinear()
                .range([chocomin, chocomax])
                .domain(extent);

            var solo_choco = d3.select("#solo-choco-svg").selectAll("rect")
                .data(data)
                .enter();

            choco_data = data;
            solo_choco.append("rect")
                .attr("width", "200")
                .attr("height", "50")
                .attr("x", "30")
                .attr("y", "60")
                .attr("rx", "0");

            solo_choco.append("rect")
                .attr("width", "200")
                .attr("height", "100")
                .attr("x", "30")
                .attr("y", "10")
                .attr("rx", "50");

            solo_choco.append("rect")
                .attr("class", function (d, i) {
                    console.log(d);
                    return "solo-choco-" + i;
                })
                .attr("width", function (d) {
                    console.log(d);
                    return choco_scale(d);
                })
                .attr("height", "60%")
                .attr("x", function (d, i) {
                    return 45 + (i * 35);
                })
                .attr("y", "35")
                .attr("rx", "2")
                .on("mouseout", function (d, i) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", "1");
                    d3.selectAll(".choco-layer-main-" + i)
                        .transition()
                        .duration(200)
                        .style("opacity", "1");
                    d3.select("#solo-choco-info")
                        .text(hover_msg);
                    d3.select("#overall-info")
                        .text(hover_msg);
                })
                .on("mouseenter", function (d, i) {
                    d3.select(this)
                        .style("cursor", "pointer")
                        .transition()
                        .duration(200)
                        .style("opacity", "0.5");
                    d3.selectAll(".choco-layer-main-" + i)
                        .style("cursor", "pointer")
                        .transition()
                        .duration(200)
                        .style("opacity", "0.5");
                    d3.select("#solo-choco-info")
                        .text(function () {
                            return data_labels[i].replace("_100g", "") + " " + d + unit;
                        });
                    d3.select("#overall-info")
                        .text(function () {
                            if (d > overall_averages[i]) {
                                return chosen_choco + " has more " + data_labels[i].replace("_100g", "") + " than most " + chosen_brand + " chocolates.";
                            } else {
                                return chosen_choco + " has lesser " + data_labels[i].replace("_100g", "") + " than most " + chosen_brand + " chocolates.";
                            }
                        });
                });

        }

        // Overall data section
        function sync_overall_data(chosen_b) {

            var label_extents = [], averages = [];
            data_labels.forEach(function make_choco(labelname) {
                //console.log(labelname);
                var extent = d3.extent(myData, function (d) {
                    if (d.brands_tags === chosen_b) {
                        return parseFloat(d[labelname]);
                    }
                });
                //console.log(extent);
                label_extents.push(extent);
                //console.log(extent);
                var mean = d3.mean(myData, function (d) {
                    if (d.brands_tags === chosen_b) {
                        return parseFloat(d[labelname]);
                    }
                });
                //console.log(mean);
                averages.push(mean);
            });
            //console.log(label_extents);
            var min = 100, max = 0;
            for (var i = 0; i < label_extents.length; i++) {
                var lmin = d3.min(label_extents[i]);
                var lmax = d3.max(label_extents[i]);
                if (lmin < min) {
                    min = lmin;
                }
                if (lmax > max) {
                    max = lmax;
                }
            }
            //console.log(min, max);
            var chocomin = 0, chocomax = 11;
            var overall_scale = d3.scaleLinear()
                .range([chocomin, chocomax])
                .domain([min, max]);

            overall_averages = averages;

            var overall = d3.select("#overall-data").selectAll("svg")
                .data(averages)
                .enter()
                .append("svg")
                .attr("width", "100%")
                .attr("height", "57");

            for (var chunks = 0; chunks < 11; chunks++) {
                svg_chunk = overall.append("svg")
                    .attr("class", "choco-chunk")
                    .attr("width", "40")
                    .attr("height", "57")
                    .attr("x", chunks * 40);
                svg_chunk.append("rect").attr("class", "choco-layer-dark");
                svg_chunk.append("rect").attr("class", "choco-layer-light");
                svg_chunk.append("rect").attr("class", function (d, i) {
                    if (chunks <= Math.trunc(overall_scale(d))) {
                        return "choco-layer-main-" + i;
                    }
                    return "choco-layer-main";
                })
                    .on("mouseenter", function (d, i) {
                        d3.selectAll(".solo-choco-" + i)
                            .transition()
                            .duration(200)
                            .style("opacity", "0.5");
                        d3.selectAll(".choco-layer-main-" + i)
                            .style("cursor", "pointer")
                            .transition()
                            .duration(200)
                            .style("opacity", "0.5");
                        d3.select("#solo-choco-info")
                            .text(function () {
                                return data_labels[i].replace("_100g", "") + " " + choco_data[i] + unit;
                            });
                        d3.select("#overall-info")
                            .text(function () {
                                if (choco_data[i] > d) {
                                    return chosen_choco_name + " has more " + data_labels[i].replace("_100g", "") + " than most " + chosen_brand + " chocolates.";
                                } else {
                                    return chosen_choco_name + " has lesser " + data_labels[i].replace("_100g", "") + " than most " + chosen_brand + " chocolates.";
                                }
                            });
                    })
                    .on("mouseout", function (d, i) {
                        d3.selectAll(".solo-choco-" + i)
                            .transition()
                            .duration(200)
                            .style("opacity", "1");
                        d3.selectAll(".choco-layer-main-" + i)
                            .transition()
                            .duration(200)
                            .style("opacity", "1");
                        d3.select("#solo-choco-info")
                            .text(hover_msg);
                        d3.select("#overall-info")
                            .text(hover_msg);
                    });
                svg_chunk.append("line")
                    .attr("class", "choco-line")
                    .attr("x1", "0")
                    .attr("y1", "0")
                    .attr("x2", "4")
                    .attr("y2", "4");
            }

            overall.append("text")
                .attr("class", "normal-text")
                .attr("x", chunks * 40 + 5)
                .attr("y", "50%")
                .text(function (d) {
                    return (Math.round(d * 100) / 100) + unit;
                });
            //console.log("done!")
        }

    });