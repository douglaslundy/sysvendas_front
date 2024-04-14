import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllSales, getAllSalesPerDate } from "../../store/fetchActions/sale";
import { setDateToSearch } from "../helpers/formatt/date/setDateToSearch";
import Head from 'next/head';


const SalesOverview = () => {

  return (
    // <BaseCard title={`Resumo - ${sales?.length} vendas realizadas em ${new Date().getFullYear()}`}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      <iframe
        width="980"
        height="850"
        src="https://lookerstudio.google.com/embed/reporting/d1aca8b4-f198-4a5c-8cdd-7397ee146470/page/ul1tD"
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
      </iframe>


    </div>
    //   <h5>Em 16/03/2024 foi inserido métodos de pagamento como Cartão e Cheque!</h5>
    // </BaseCard>
  );
};

export default SalesOverview;