import React, { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  timeFields,
  daysOfWeek,
  whatday,
  timeStringToDate,
} from "../constants";
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
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", [0, 0, Dimensions.width, Dimensions.height])
      .style("background-color", "white")
      .classed("svg-content", true);

    const xScale = d3
      .scaleTime()
      .domain([new Date(0, 0, 0, 5, 0, 0, 0), new Date(0, 0, 0, 24, 0, 0, 0)])
      .range([
        Dimensions.padding * 2,
        Dimensions.width - 2 * Dimensions.padding,
      ]);

    const drawXAxis = () => {
      const tickValues = [];
      for (let i = 5; i <= 24; i++) {
        tickValues.push(new Date(0, 0, 0, i, 0, 0, 0));
      }

      const xAxis = d3
        .axisBottom(xScale)
        .tickValues(tickValues)
        .tickFormat(d3.timeFormat("%I%p"));
      svg
        .append("g")
        .attr(
          "transform",
          `translate(${Dimensions.padding}, ${Dimensions.height -
            2 * Dimensions.padding})`
        )
        .call(xAxis)
        .style("font-size", "12")
        .style("color", "black")
        .style("font-family", "sans-serif")
        .style("text-anchor", "middle");
    };

    // const drawXAxis = () => {
    //   const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%H"));
    //   svg
    //     .append("g")
    //     .attr(
    //       "transform",
    //       `translate(0, ${Dimensions.height - 2 * Dimensions.padding})`
    //     )

    //     .call(xAxis)
    //     .style("font-size", "12")
    //     .style("color", "black")
    //     .style("font-family", "sans-serif")
    //     .style("text-anchor", "middle");
    // };

    // const drawXAxis = () => {
    //   svg
    //     .append("g")
    //     .selectAll("text")
    //     .data(timeFields.map((t) => (t.includes(":00") ? t : "")))
    //     .join("text")
    //     .text((t) => `${t.replace(":00", "")}`)
    //     .attr("x", (t, i) =>
    //       i % 2 == 0 ? xScale(i) + Dimensions.padding : (t = null)
    //     )
    //     .attr("y", Dimensions.height - Dimensions.padding)
    //     .attr("fill", "black")
    //     .style("font-size", "12")
    //     .style("font-family", "sans-serif")
    //     .style("text-anchor", "middle");
    // };

    const yScale = d3
      .scaleTime()
      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 0, 7, 0, 0, 0, 0)])
      .range([
        Dimensions.padding * 2,
        Dimensions.height - 2 * Dimensions.padding,
      ]);
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
          (d, i) => Dimensions.height - (i * 20 + 4 * Dimensions.padding)
        )
        .attr("fill", "black")
        .style("font-size", "12")
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
          if (frequency <= 15) {
            return "#87F5FB";
          } else if (frequency <= 25) {
            return "#69b3a2";
          } else if (frequency <= 35) {
            return "#FABC2A";
          } else if (frequency <= 50) {
            return "#F55D3E";
          } else {
            return "#FF101F";
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
          return timeStringToDate(item["time"]);
        })
        .attr("count", (item) => {
          return item["frequency"];
        })
        .attr("height", () => {
          return (Dimensions.height - 2 * Dimensions.padding) / 7 - 2;
        })
        .attr("y", (item, i) => {
          return (
            yScale(new Date(0, 0, whatday(item["day"]) - 1, 0, 0, 0, 0)) -
            Dimensions.padding
          );
        })
        .attr("width", () => {
          return (Dimensions.width - 2 * Dimensions.padding) / 38 - 2;
        })
        .attr("x", (item, i) => {
          return xScale(timeStringToDate(item["time"])) + Dimensions.padding;
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    };

    drawXAxis();
    drawYAxis();
    drawRectangles();
  }, []);

  useEffect(() => {
    heatmapFunction();
  }, [heatmapFunction]);

  return <svg ref={svgRef}></svg>;
};

export default HeatMap;
