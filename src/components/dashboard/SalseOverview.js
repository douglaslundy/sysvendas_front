import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllSales, getAllSalesPerDate } from "../../store/fetchActions/sale";
import { setDateToSearch } from "../helpers/formatt/date/setDateToSearch";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {

  const dispatch = useDispatch();
  const { sales } = useSelector(state => state.sales);
  const [chartIsRead, setChartIsRead] = useState(false);

  const [monthsInCash, setMonthsInCash] = useState({
    jan: 0,
    feb: 0,
    march: 0,
    apr: 0,
    may: 0,
    jun: 0,
    july: 0,
    aug: 0,
    sept: 0,
    oct: 0,
    nov: 0,
    dec: 0
  });

  const [monthsOnTerm, setMonthsOnTerm] = useState({
    jan: 0,
    feb: 0,
    march: 0,
    apr: 0,
    may: 0,
    jun: 0,
    july: 0,
    aug: 0,
    sept: 0,
    oct: 0,
    nov: 0,
    dec: 0
  });

  const totalSalesByMonthInCash = () => {
    const monthNames = ["jan", "feb", "march", "apr", "may", "jun", "july", "aug", "sept", "oct", "nov", "dec"];
    let salesInCash = { ...monthsInCash };
    let salesOnTerm = { ...monthsOnTerm };

    sales.forEach(sale => {
      const monthIndex = new Date(sale.created_at).getMonth();
      const monthKey = monthNames[monthIndex];

      if (sale.type_sale === "in_cash") {
        salesInCash[monthKey] += sale.total_sale;
      } else if (sale.type_sale === "on_term") {
        salesOnTerm[monthKey] += sale.total_sale;
      }
    });

    setMonthsInCash(salesInCash);
    setMonthsOnTerm(salesOnTerm);
  };

  const totalSalesCountByMonth = () => {
    const monthNames = ["jan", "feb", "march", "apr", "may", "jun", "july", "aug", "sept", "oct", "nov", "dec"];
    let salesCountInCash = { ...monthsInCash };
    let salesCountOnTerm = { ...monthsOnTerm };

    sales.forEach(sale => {
      const monthIndex = new Date(sale.created_at).getMonth();
      const monthKey = monthNames[monthIndex];

      if (sale.type_sale === "in_cash") {
        salesCountInCash[monthKey] += 1;
      } else if (sale.type_sale === "on_term") {
        salesCountOnTerm[monthKey] += 1;
      }
    });

    setMonthsInCash(salesCountInCash);
    setMonthsOnTerm(salesCountOnTerm);
  };

  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "89%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },

    colors: ["#fb9678", "#03c9d7"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: true,
    },
    xaxis: {
      type: "category",
      categories: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: sales.lenght,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 1,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriessalesoverview = [
    {
      name: "Vendas a prazo",
      // data: [monthsOnTerm.jan, monthsOnTerm.feb, monthsOnTerm.march, monthsOnTerm.apr, monthsOnTerm.may, monthsOnTerm.jun, monthsOnTerm.july, monthsOnTerm.aug, monthsOnTerm.sept, monthsOnTerm.oct, monthsOnTerm.nov, monthsOnTerm.dec],
        data : [ ...Object.values(monthsOnTerm) ]
    },
    {
      name: "Vendas a vista",
      // data: [monthsInCash.jan, monthsInCash.feb, monthsInCash.march, monthsInCash.apr, monthsInCash.may, monthsInCash.jun, monthsInCash.july, monthsInCash.aug, monthsInCash.sept, monthsInCash.oct, monthsInCash.nov, monthsInCash.dec],
      data : [ ...Object.values(monthsInCash) ]
    },
  ];

  useEffect(() => {
    dispatch(getAllSalesPerDate(setDateToSearch(1, 0), setDateToSearch(31, 11)));
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      if (chartIsRead == false) {
        totalSalesCountByMonth();
        setChartIsRead(true);
      }
    }
  }, [sales]);


  return (
    <BaseCard title={`Resumo - ${sales.length} vendas realizadas em ${new Date().getFullYear()}`}>
      {chartIsRead &&
        <Chart
          options={optionssalesoverview}
          series={seriessalesoverview}
          type="bar"
          height="400px"
        />
      }
    </BaseCard>
  );
};

export default SalesOverview;