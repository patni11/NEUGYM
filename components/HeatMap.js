import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { timeFields, daysOfWeek, whatday } from "../constants";
import { svg } from "d3";

const HeatMap = ({ gymData, loc }) => {
  const svgRef = useRef();
  const [data, setData] = useState(gymData);

  const heatmapFunction = useCallback(() => {
    const Dimensions = {
      width: 800,
      height: 200,
      padding: 15,
    };

    const color = d3
      .scaleSequential([0, 120], d3.interpolatePiYG)
      .unknown("none");
    setData(gymData);
    const svg = d3.select(svgRef.current);

    svg
      .attr("width", Dimensions.width)
      .attr("height", Dimensions.height)
      .attr("viewBox", [0, 0, Dimensions.width, Dimensions.height])
      .attr("style", "max-width: auto; height: auto; height: intrinsic;")
      .style("background-color", "white");

    const xScale = d3
      .scaleLinear()
      .domain([0, 38])
      .range([
        Dimensions.padding * 2,
        Dimensions.width - 2 * Dimensions.padding,
      ]);

    const yScale = d3
      .scaleTime()
      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 0, 7, 0, 0, 0, 0)])
      .range([
        Dimensions.padding * 2,
        Dimensions.height - 2 * Dimensions.padding,
      ]);

    const drawXAxis = () => {
      svg
        .append("g")
        .selectAll("text")
        .data(timeFields.map((t) => (t.includes(":00") ? t : "")))
        .join("text")
        .text((t) => `${t.replace(":00", "")}`)
        .attr("x", (t, i) =>
          i % 2 == 0 ? xScale(i) + Dimensions.padding : (t = null)
        )
        .attr("y", Dimensions.height - Dimensions.padding)
        .attr("fill", "black")
        .style("font-size", "10")
        .style("font-family", "sans-serif")
        .style("text-anchor", "middle");
    };

    const drawYAxis = () => {
      svg
        .append("g")
        .selectAll("text")
        .data(daysOfWeek)
        .join("text")
        .text((d) => d)
        .attr("x", Dimensions.padding * 2)
        .attr(
          "y",
          (d, i) => Dimensions.height - (i * 25 + 2 * Dimensions.padding)
        )
        .attr("fill", "black")
        .style("font-size", "10")
        .style("font-family", "sans-serif")
        .style("text-anchor", "end");
    };

    const tooltip = d3.select("#tooltip" + loc);

    const drawRectangles = () => {
      svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("fill", (item) => {
          let frequency = item["frequency"];
          if (frequency <= 20) {
            return "#69b3a2";
          } else if (frequency <= 35) {
            return "#FFFC99";
          } else if (frequency <= 50) {
            return "#F55D3E";
          } else {
            return "#D11149";
          }
        })
        .on("mouseover", (item, d) => {
          tooltip.transition().style("visibility", "visible");
          tooltip.html(
            d["day"] +
              " " +
              d["time"] +
              " : <strong style='color:#70ECFF'>" +
              d["frequency"] +
              "</strong>"
          );
        })
        .on("mouseout", (item) => {
          tooltip.transition().style("visibility", "hidden");
        })
        .attr("day", (item) => {
          return item["day"];
        })
        .attr("time", (item) => {
          return item["time"];
        })
        .attr("count", (item) => {
          return item["frequency"];
        })
        .attr("height", () => {
          return (Dimensions.height - 2 * Dimensions.padding) / 7 - 1;
        })
        .attr("y", (item, i) => {
          return (
            yScale(new Date(0, 0, whatday(item["day"]) - 1, 0, 0, 0, 0)) -
            Dimensions.padding
          );
        })
        .attr("width", () => {
          return (Dimensions.width - 2 * Dimensions.padding) / 38 - 1;
        })
        .attr("x", (item, i) => {
          return xScale(i % 38) + Dimensions.padding;
        });
    };

    drawXAxis();
    drawYAxis();
    drawRectangles();
  }, []);

  useEffect(() => {
    heatmapFunction();
  }, [heatmapFunction]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default HeatMap;
