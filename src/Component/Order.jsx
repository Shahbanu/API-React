import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { DatePicker, Space, Select } from "antd";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
const { RangePicker } = DatePicker;
import { DownloadOutlined } from "@ant-design/icons";

const Order = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setIsloading] = useState(true);
  //date filter
  const [dateRange, setDateRange] = useState([]);
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  //tabs-api
  const [value, setValue] = React.useState("All");
  const [OrderStatusId, setOrderStatusId] = useState('');
  //shipping status
  const [shippingValue,setShippingValue]=useState("Shipping Status")
  const [shippingStatus, setShippingStatus] = useState('');
  const Navigate = useNavigate();
  //stopping next page 
  const [CurrentPageApi ,setCurrentPageApi]=useState(1)//current_page
  const [LastPageApi ,setLastPageApi]=useState(1)//last_page

  function fetchData() {
    const token = localStorage.getItem("token");
    let startDate = null;
    let endDate = null;

    if (dateRange && dateRange.length === 2) {
        startDate = dateRange[0]?.format("YYYY-MM-DD");
        endDate = dateRange[1]?.format("YYYY-MM-DD");
    }


    var url = `https://testapi.mair.co.ae/api/order/list?limit=10&page=${currentPage}&orderStatus=${OrderStatusId}&shippingStatus=${shippingStatus}`;
    // setApiUrl(url);
    // Determine the API URL based on the selected tab value
    
    axios
      .get(`${url}`, {
        params: { startDate, endDate }, // Pass date filter parameters as query parameters
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // console.log("Response", res.data.data.data);
        setIsloading(false);
        setOrderList(res.data.data.data);
        setTotalPages(res.data.data.totalPages);
        setCurrentPageApi(res.data.data.current_page)
        setLastPageApi(res.data.data.last_page)
        // console.log(res.data.data.totalpages);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
      if (!startDate && !endDate) {
        // Assuming `redirectToMainPage()` is a function to redirect to the main page
       Navigate('/order'); 
    }
  }

  useEffect(() => {
    fetchData(currentPage);
    
  }, [currentPage, dateRange, loading, value,shippingValue,CurrentPageApi]);
  if (loading)
    return (
      <div style={{ color: "green", textAlign: "center" }}>Loading...</div>
    );
  //date-filter
  const handleDateChange = (dates) => {
    console.log(dates);
    // Update date range state when date filter changes
    setDateRange(dates);
  };

 
  //pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };
  //tabs
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    setCurrentPage(1);
    if (newValue === "All") {
     setOrderStatusId('')
    } else if (newValue === "Pending") {
      setOrderStatusId(0)

    } else if (newValue === "Processing") {
      setOrderStatusId(1)

    } else if (newValue === "Vendor Accepted") {
      setOrderStatusId(2)

    } else if (newValue === "Completed") {
      setOrderStatusId(3)

    } else if (newValue === "Cancelled") {
      setOrderStatusId(4)

    } else {
      setOrderStatusId('')

    }


    fetchData();
    // console.log("apds", returnAPi(newValue
  };
  //shipping status
  const handleShippingStatus = (newshippingValue) => {
    setShippingValue(newshippingValue);
    setCurrentPage(1);
    if (newshippingValue === "Shipping Status") {
     setShippingStatus('')
    } else if (newshippingValue === "Shipping Not Required") {
      setShippingStatus(0)

    } else if (newshippingValue === "Not Yet Shipped") {
      setShippingStatus(1)

    } else if (newshippingValue === "Driver Assigned") {
      setShippingStatus(2)

    } else if (newshippingValue === "Driver Accepted") {
      setShippingStatus(3)

    } else if (newshippingValue === "Delivered") {
      setShippingStatus(4)

    } else {
      setShippingStatus('')

    }


    fetchData();
    // console.log("apds", returnAPi(newValue
  };

function handleNext(){
  // if()
  // current == last page
  // return true;
  if(CurrentPageApi===LastPageApi){
    return true;
  }else{
  
  return false;
}
}
//download
const handleDownload = (orderId) => {
  // Make an API call to fetch the PDF file for the order
  const token = localStorage.getItem("token");
  axios.get(`https://testapi.mair.co.ae/api/order/invoicePdf/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob', // Set response type to blob
  })
  .then(response => {
    // Create a URL for the blob data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    // Set the file name
    link.setAttribute('download', `order_${orderId}.pdf`);
    // Append the link to the document body
    document.body.appendChild(link);
    // Click the link to trigger the download
    link.click();
    // Remove the link from the document body
    document.body.removeChild(link);
  })
  .catch(error => {
    console.error('Error downloading PDF:', error);
  });
};

  return (
    <div>
      <h1>Orders List</h1>
      <div
        className="head-container"
        style={{ padding: "15px", border: "1px solid #ede2e2" }}
      >
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
          >
            <Tab value="All" label="All" />
            <Tab value="Pending" label="Pending" />
            <Tab value="Processing" label="Processing" />
            <Tab value="Vendor Accepted" label="Vendor Accepted" />
            <Tab value="Completed" label="Completed" />
            <Tab value="Cancelled" label="Cancelled" />
          </Tabs>
        </Box>
        &nbsp;&nbsp;&nbsp;
        <Space direction="vertical" size={12}>
          <RangePicker onChange={handleDateChange}  />
        </Space>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Space>
          <Select
            placeholder="Payment Method"
            style={{ width: 180 }}
            
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
              { value: "disabled", label: "Disabled", disabled: true },
            ]}
          />
        </Space>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Space>
        <Select
  onChange={handleShippingStatus}
  placeholder="Shipping Status"
  style={{ width: 180 }}
>
  <Select.Option value="Shipping Status">Shipping Status</Select.Option>
  <Select.Option value="Shipping Not Required">Shipping Not Required</Select.Option>
  <Select.Option value="Not Yet Shipped">Not Yet Shipped</Select.Option>
  <Select.Option value="Driver Assigned">Driver Assigned</Select.Option>
  <Select.Option value="Driver Accepted">Driver Accepted</Select.Option>
  <Select.Option value="Delivered">Delivered</Select.Option>
</Select>

        </Space>
      </div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">CustomerId</th>
            <th scope="col">StoredId</th>
            <th scope="col">OrderStatusId</th>
            <th scope="col">PaymentStatusId</th>
            <th scope="col">ShippingStatus</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order, index) => (
            <tr key={index}>
              <th scope="row">{order.Id}</th>
              <td>{order.CustomerId}</td>
              <td>{order.StoreId}</td>
              <td>{order.OrderStatusId}</td>
              <td>{order.PaymentStatusId}</td>
              <td>{order.ShippingStatusId}
              </td>
              <DownloadOutlined onClick={() => handleDownload(order.Id)}/>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          
          {renderPagination()}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={handleNext()}
            >
              Next
            </button>
          </li>
       
        </ul>
      </nav>
    </div>
  );
};

export default Order;

