import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllSales, getAllSalesPerDate } from "../../store/fetchActions/sale";
import { setDateToSearch } from "../helpers/formatt/date/setDateToSearch";
import Head from 'next/head';


const SalesOverview = () => {
  const iframeUrl = "https://mb.dlsistemas.com.br/public/dashboard/9ecd914e-a981-4957-bb5d-1f6fe7a63139";

  return (
    // <BaseCard title={`Resumo - ${sales?.length} vendas realizadas em ${new Date().getFullYear()}`}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      <iframe
        width="1200"
        height="900"
        // src="https://lookerstudio.google.com/embed/reporting/d1aca8b4-f198-4a5c-8cdd-7397ee146470/page/ul1tD"
        src={iframeUrl}
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox">
      </iframe>


      {/* <h5>2.1.2</h5> */}
      {/* <h5>2.1.3</h5> */}
      Version - <h5>2.1.6</h5>
    </div>
    // </BaseCard>
  );
};

export default SalesOverview;