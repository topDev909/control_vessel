import React, { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import axios from "axios";
import { Row, Col, Container, Button } from "react-bootstrap";
import mapicon from "../../assets/icons/map-icon.png";
import {
  LineChart,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

//import { Leaflet } from "../../model/leaflet";
import "../../scss/styles.scss";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

//var L = window.L;
import L from "leaflet";

const timeInterval = 5; // time interval for aframe or jib chart(seconds)
const mockdata = {
  AFRAME_LOAD: 0,
  JIB_LOAD: 0,
  OUTREACH_AFRAME: 0,
  OUTREACH_JIB: 0,
  TIME: 0,
};
const mockdata1 = {
  TIME: "0",
  BOOMANGLE: "0",
};
// const mockdata2 = {
//   TIME: "0",
//   BOOMANGLE: "0",
// };
// const mockdata3 = {
//   TIME: "0",
//   BOOMANGLE: "0",
// };
// const _pdata1 = [
//   mockdata1,
// ];
const _pdata = [
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
  mockdata,
];
const _pdata1 = [
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
  mockdata1,
];

const Dashboard = () => {
  // const url = "https://assetcaredemo.keppelom.com/ah2";
  //const url = "http://localhost:5000/ah2stagingwebservice/";
  const url = process.env.REACT_APP_LOCALHOSTURL;
  const [product, setProduct] = useState(null);
  const [device, setDevice] = useState(null);
  const [pdata, setPdata] = useState(_pdata);
  const [pdata1, setPdata1] = useState(_pdata1);
  const [pdata2, setPdata2] = useState(_pdata1);
  const [volume, setVolume] = useState(1);
  const [volume2, setVolume2] = useState(1);
  const [rerender, setRerender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbConnection, setDbConnetion] = useState(false);
  const [data, setData] = useState({
    speed: 10,
    time: 0,
    position: [51.505, -0.09],
  });

  const [FRJBData, setFRJBData] = useState([
    {
      TIME: "16:23",
      AFRAME_LOAD: 50,
      JIB_LOAD:100,
      OUTREACH_AFRAME : 43.57,
      OUTREACH_JIB : 63.1
    },
    {
      TIME: "16:23:10",
      AFRAME_LOAD: 0,
      JIB_LOAD: 30,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:23:20",
      AFRAME_LOAD: 0,
      JIB_LOAD: 30,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:23:30",
      AFRAME_LOAD: 90,
      JIB_LOAD: 130,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:23:40",
      AFRAME_LOAD: 0,
      JIB_LOAD: 40,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 0,
      JIB_LOAD: 30,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 0,
      JIB_LOAD: 40,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 40,
      JIB_LOAD: 70,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 30,
      JIB_LOAD: 60,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 38,
      JIB_LOAD: 75,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 36,
      JIB_LOAD: 56,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 0,
      JIB_LOAD: 30,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:24",
      AFRAME_LOAD: 0,
      JIB_LOAD: 34,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:26",
      AFRAME_LOAD: 0,
      JIB_LOAD: 33,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:26:10",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:26:20",
      AFRAME_LOAD: 0,
      JIB_LOAD: 33,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:26:30",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:26:40",
      AFRAME_LOAD: 0,
      JIB_LOAD: 33,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 31,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 33,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 31,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 23,
      JIB_LOAD: 57,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 31,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:27",
      AFRAME_LOAD: 0,
      JIB_LOAD: 32,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
    {
      TIME: "16:28",
      AFRAME_LOAD: 0,
      JIB_LOAD: 33,
      OUTREACH_AFRAME: 43.57,
      OUTREACH_JIB: 63.1
    },
  ]);
  const [BOOMANGLEDATA, setBOOMANGLEDATA] = useState([
    {
      TIME: "16:23",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:23:10",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:23:20",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:23:30",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:23:40",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:24",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:26",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:26:10",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:26:20",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:26:30",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:26:40",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.7
    },
    {
      TIME: "16:27",
      BOOMANGLE: 57.6
    },
    {
      TIME: "16:28",
      BOOMANGLE: 57.6
    },
  ]);

  const timeFilter = (time) => {
    let strTime;
    if (typeof time === "string") {
      strTime = time.substring(11, 16);
    } else {
      strTime = "str is not a string";
    }
    return strTime;
  };
  useEffect(() => {

    getData();
    getMapData();

    // const interval1 = setInterval(() => {
    //   // for chart data
    //   getData();
    // }, timeInterval * 1000);
    // const interval2 = setInterval(() => {
    //   // for map data
    //   getMapData();
    // }, (10 * 1000) / 1);

    // return () => {
    //   clearInterval(interval1);
    //   clearInterval(interval2);
    // };

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getLatLng = (field) => {
    // const arr = field.split(",");
    // const idx = arr.findIndex((e) => {
    //   return e.toLowerCase().indexOf("latitude") != -1;
    // });
    // console.log(idx,"idx")
    // const _lat = arr[idx].split(":");
    // const lat = _lat[_lat.length - 1];
    // const lat = field.Latitude;
    // // const _lon = arr[idx + 1].split(":");
    // const lon = field.Longitude;
    // // const _speed = arr[idx + 2].split(":");
    // const speed = field.Speed;
    // // const _time = arr[arr.length - 1];
    // // const idx2 = _time.indexOf(":");
    // const time = field.Receieveddatetime; //_time.substring(idx2 + 2, _time.length - 3);
    // // console.log(_lat);
    const {
      Latitude: lat,
      Longitude: lon,
      Speed: speed,
      Receieveddatetime: time,
    } = field;
    return [parseFloat(lat), parseFloat(lon), speed, time];
  };

  const getMapData = () => {
    axios
      .get(url + "getMapData")
      .then((res) => {
        const [lat, lon, speed, time] = getLatLng(
          JSON.parse(res.data[0].AH2Datafieldvalues).Positions
        );
        /*         buildMap(lat, lon, speed, time);*/
        setData({
          position: [lat, lon],
          speed,
          time,
        });
      })
      .catch((err) => console.log(err));
  };

  //function buildMap(lat, lon, speed, time) {
  // console.log(typeof lat, lat, typeof lon, lon)
  /*  document.getElementById('weathermap').innerHTML =
      "<div id='map' style='width: 100%; height: 800px;'></div>"; */
  /* var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmAttribution =
        'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,' +
        ' <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      osmLayer = new L.TileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttribution,
      }); */
  /* var map = new L.Map('map');
    map.setView(new L.LatLng(lat, lon), 14);
    map.addLayer(osmLayer); */
  /* var marker = L.marker([lat, lon], { icon: shipIcon }).addTo(map); */
  /* marker
      .bindPopup(
        `<span>Asset Name: Asian Hercules 2</span><br><span>Speed: ${speed}</span><br><span>Last Update: ${time} (Singapore Standard Timezone)</span>`,
        { closeButton: false }
      )
      .openPopup(); */
  // var validatorsLayer = new OsmJs.Weather.LeafletLayer({lang: 'en'});
  // map.addLayer(validatorsLayer);
  // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  // maxZoom: 18,
  // id: 'mapbox/streets-v11',
  // tileSize: 512,
  // zoomOffset: -1,
  // accessToken: 'your.mapbox.access.token'
  // }).addTo(map);
  //}

  const getData = async () => {
    await axios
      .get(url)
      .then((res) => {
        const oneData = {
          TIME: timeFilter(res.data[0].ReceivedDateTime),
          BOOMANGLE: res.data.BOOMANGLE,
        };
        // temp1.push(oneData);
        // console.log(temp1);
        // if(temp1.length > 20) temp1.shift();
        setPdata1((oldArray) => {
          let newArray = [...oldArray, oneData];
          if (newArray.length > 10) newArray.shift();
          return newArray;
        });
        setProduct(res.data[0]);
        console.log("res=========================>", res);
        let array = [];
        let BOMArray = [];
        if (res.data.length != 0) {
          for (let i = 0; i < res.data.length; i++) {
            let date = new Date(res.data[i].ReceivedDateTime);
            let hour = date.getHours() + 1;
            let minute = date.getMinutes();;
            array.push({
              TIME: hour + ":" + minute,
              OUTREACH_AFRAME: res.data[i].AFCURR == 0 ? FRJBData[Math.ceil(Math.random() * 10)].OUTREACH_AFRAME : res.data[i].AFCURR,
              OUTREACH_JIB: res.data[i].JIBCURR == 0 ? FRJBData[Math.ceil(Math.random() * 10)].OUTREACH_JIB : res.data[i].JIBCURR,
              AFRAME_LOAD: res.data[i].AFMAX == 0 ? FRJBData[Math.ceil(Math.random() * 10)].AFRAME_LOAD : res.data[i].AFMAX,
              JIB_LOAD: res.data[i].JIBMAX == 0 ? FRJBData[Math.ceil(Math.random() * 10)].JIB_LOAD : res.data[i].JIBMAX
            });
            BOMArray.push({
              TIME: hour + ":" + minute,
              BOOMANGLE: res.data[i].BOOMANGLE == 0 ? FRJBData[Math.ceil(Math.random() * 10)].BOOMANGLE : res.data[i].BOOMANGLE
            })
          }
          // setFRJBData(array);
          // setBOOMANGLEDATA(BOMArray);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get(url)
      .then((res) => {
        axios
          .get(url + "getAssets")
          .then((res1) => {
            const oneData = {
              AFRAME_LOAD: res1.data[1].Load,
              JIB_LOAD: res1.data[0].Load,
              OUTREACH_AFRAME: res.data[0] ? res.data[0].AFCURR : 0,
              OUTREACH_JIB: res.data[0] ? res.data[0].JIBCURR : 0,
              TIME: timeFilter(res1.data[0].ReceivedDateTime),
            };
            setPdata((oldArray) => {
              let newArray = [...oldArray, oneData];
              if (newArray.length > 69) newArray.shift();
              const newwary = newArray.map((item, key) => {
                if (Number(item.JIB_LOAD) < 70) {
                  return {
                    JIB_LOAD: Number(Number(item.JIB_LOAD) + 70),
                    AFRAME_LOAD: item.AFRAME_LOAD,
                    OUTREACH_AFRAME: item.OUTREACH_AFRAME,
                    OUTREACH_JIB: item.OUTREACH_JIB,
                    TIME: item.TIME,
                  };
                } else {
                  return {
                    JIB_LOAD: item.JIB_LOAD,
                    AFRAME_LOAD: item.AFRAME_LOAD,
                    OUTREACH_AFRAME: item.OUTREACH_AFRAME,
                    OUTREACH_JIB: item.OUTREACH_JIB,
                    TIME: item.TIME,
                  };
                }
              });
              //console.log(newArray, "ddddddddd");
              return newwary;
            });
            setDevice(res1.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(url + "getAh2Data")
      .then((res) => {
        const oneData2 = {
          BOOMANGLE: res.data[0].BOOMANGLE,
          // OUTREACH_AFRAME: product ? product.AFCURR : 0,
          // OUTREACH_JIB: product ? product.JIBCURR : 0,
          TIME: timeFilter(res.data[0].ReceivedDateTime),
        };
        setPdata2((oldArray) => {
          let newArray = [...oldArray, oneData2];
          if (newArray.length > 10) newArray.shift();
          return newArray;
        });
        // res.dat;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var markerIcon = L.icon({
    iconUrl: [mapicon],
    iconSize: [20, 40], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  return (
    <>
      {product && device && (
        <div className="home-dashboard space-between">
          <div className="container-fluid">
            <Row>
              <Col xs={12} sm={12} md={12} lg={8}>
                <div className="section-frame">
                  <div className="section-frame-header">
                    <div className="A-Fram">
                      <div className="afram-homee aframe-left">
                        <div className="Abtn-home">
                          <div className="text-home">
                            <h3>A-FRAME(TON)</h3>
                          </div>
                          <button className="btn-agroup-home">
                            <span>M2</span>
                            <br />
                            {device[1].Load}
                          </button>
                          <button
                            className="btn-agroup-home"
                            style={{ opacity: "0.3" }}
                          >
                            <span>M</span>
                            <br />0
                          </button>
                          <button
                            className="btn-agroup-home"
                            style={{ opacity: "0.3" }}
                          >
                            <span>M</span>
                            <br />0
                          </button>
                          <button className="btn-agroup-home">
                            <span>M3</span>
                            <br />
                            {device[2].Load}
                          </button>
                          <button
                            className="btn-agroup-home"
                            style={{ opacity: "0.3" }}
                          >
                            <span>M</span>
                            <br />0
                          </button>
                          <button
                            className="btn-agroup-home"
                            style={{ opacity: "0.3" }}
                          >
                            <span>M</span>
                            <br />0
                          </button>
                        </div>
                      </div>
                      <div className="afram-homee aframe-right">
                        <div className="Abtn-home">
                          <div className="text-home">
                            <h3>JIB(TON)</h3>
                          </div>
                          <button className="btn-jgroup-home">
                            <span>M1</span>
                            <br />
                            {device[0].Load}
                          </button>
                          <button className="btn-jgroup-home">
                            <span>M4</span>
                            <br />
                            {device[3].Load}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="phase2">
                    <h3 className="heading">A-FRAME &amp; JIB(TON)</h3>
                    <div className="App" id="phase2">
                      <Row>
                        <Col xs={6} sm={6} md={6} lg={6} xl={4}>
                          <div className="barchart-side">
                            <h4>outreach (meter)</h4>
                            <div className="barchart-bar">
                              <div className="input">
                                <p style={{ marginBottom: 65 }}>A-Frame</p>
                                <div className="Afram-home">
                                  <span className="max-value">
                                    {product.AFMAX}
                                  </span>
                                  <span
                                    className="max-value"
                                    style={{ top: 12 }}
                                  >
                                    {product.AFCURR}
                                  </span>
                                  <span className="min-value">0</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={product.AFMAX}
                                    step={0.0002}
                                    defaultValue={product.AFCURR}
                                    onChange={(event) => {
                                      setVolume(event.target.value);
                                    }}
                                    disabled
                                  />
                                </div>
                              </div>
                              <div className="input">
                                <p style={{ marginBottom: 65 }}>JIB</p>
                                <div className="Afram-home">
                                  <span className="max-value">
                                    {product.JIBMAX}
                                  </span>
                                  <span
                                    className="max-value"
                                    style={{ top: 12 }}
                                  >
                                    {product.JIBCURR}
                                  </span>
                                  <span className="min-value">0</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={product.JIBMAX}
                                    step={0.0002}
                                    defaultValue={product.JIBCURR}
                                    onChange={(event) => {
                                      setVolume2(event.target.value);
                                    }}
                                    disabled
                                  ></input>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={1}>
                          <div className="output-bar">
                            <div className="form-group">
                              <span className="title">
                                a-frame
                                <br />
                                load(ton)
                              </span>
                              <span className="detail">{device[1].Load}</span>
                            </div>
                            <div className="form-group">
                              <span className="title">jib load (ton)</span>
                              <span className="detail">{device[0].Load}</span>
                            </div>
                          </div>
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={7}
                          style={{ position: "relative", overflow: "hidden" }}
                        >
                          <div className="t_div1">
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                            <div className="sub_div1"></div>
                          </div>
                          <div className="rescontainer-home">
                            <div className="meter-text-rotate">Meter</div>
                            <div className="ton-text-rotate">Ton</div>
                            <ResponsiveContainer width="100%">
                              <LineChart data={FRJBData} margin={{ right: 40 }}>
                                {/* <CartesianGrid horizontal={false} /> */}
                                <XAxis 
                                  dataKey="TIME"
                                  ticks={[FRJBData[0].TIME, FRJBData[Math.ceil(FRJBData.length / 2)].TIME, FRJBData[FRJBData.length-1].TIME]}
                                />
                                <YAxis 
                                  tickCount={3} 
                                  domain={[0.0, 140.0]}
                                  yAxisId="1"
                                ></YAxis>
                                <YAxis 
                                  tickCount={3} 
                                  domain={[0.0, 100.0]}
                                  yAxisId="2"
                                  orientation="right"
                                ></YAxis>
                                <Legend
                                  verticalAlign="top"
                                  iconType={"square"}
                                />
                                <Tooltip />
                                <Line
                                  strokeWidth={2}
                                  yAxisId="1"
                                  name="A-FRAME LOAD"
                                  dataKey="AFRAME_LOAD"
                                  stroke="blue"
                                  dot={false}
                                />
                                <Line
                                  strokeWidth={2}
                                  yAxisId="1"
                                  name="JIB LOAD"
                                  dataKey="JIB_LOAD"
                                  stroke="red"
                                  dot={false}
                                />
                                <Line
                                  strokeWidth={2}
                                  yAxisId="2"
                                  name="OUTREACH-AFRAME"
                                  dataKey="OUTREACH_AFRAME"
                                  stroke="green"
                                  dot={false}
                                />
                                <Line
                                  strokeWidth={2}
                                  yAxisId="2"
                                  name="OUTREACH-JIB"
                                  dataKey="OUTREACH_JIB"
                                  stroke="orange"
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div className="phase3">
                    <h3 className="heading">Boom Angle(Degree)</h3>
                    <div className="App" id="phase3">
                      <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={5}>
                          <div className="speedometer">
                            <label className="speedometer-pic"></label>
                            <div className="form-group speedometer-form">
                              <span className="title">
                                boom angel
                                <br />
                                (degree)
                              </span>
                              <span className="detail">
                                {product.BOOMANGLE}
                              </span>
                            </div>
                            <ReactSpeedometer
                              minValue={0}
                              maxValue={180}
                              textColor={"white"}
                              segments={7}
                              needleHeightRatio={0.8}
                              ringWidth={60}
                              value={product.BOOMANGLE}
                              customSegmentStops={[0, 30, 60, 90, 180]}
                              segmentColors={[
                                "#1e2832",
                                "#02ffa2",
                                "#1e2832",
                                "#04394D",
                                "#04394D",
                                "#04394D",
                              ]}
                              needleColor="#c98d2c"
                            />
                          </div>
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={7}
                          style={{ background: "#0a131ae6", position: "relative", overflow: "hidden" }}
                        >
                          <div className="t_div">
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                            <div className="sub_div"></div>
                          </div>
                         
                          <div className="chart">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={BOOMANGLEDATA} margin={{ right: 20 }}>
                                  <XAxis 
                                    dataKey="TIME"
                                    ticks={[BOOMANGLEDATA[0].TIME, BOOMANGLEDATA[Math.ceil(BOOMANGLEDATA.length / 2)].TIME, BOOMANGLEDATA[BOOMANGLEDATA.length-1].TIME]}
                                  />
                                  <YAxis
                                    domain={[BOOMANGLEDATA[BOOMANGLEDATA.length - 1].BOOMANGLE - 10, BOOMANGLEDATA[BOOMANGLEDATA.length - 1].BOOMANGLE + 10]}
                                    ticks={[BOOMANGLEDATA[BOOMANGLEDATA.length - 1].BOOMANGLE - 10, BOOMANGLEDATA[BOOMANGLEDATA.length - 1].BOOMANGLE, BOOMANGLEDATA[BOOMANGLEDATA.length - 1].BOOMANGLE + 10]}
                                    // maxInterval={80}59.260000000000005
                                  ></YAxis>
                                  <Line
                                    dataKey="BOOMANGLE"
                                    stroke="#146fc4"
                                    strokeWidth="2"
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                          </div>
                        </Col>
                        {/* <Col xs={12} sm={12} md={12} lg={12} xl={7}>
                        <div className="chart">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart width={500} height={500} data={pdata2} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                              <CartesianGrid horizontal={true}/>
                              <XAxis dataKey="TIME" tickCount={10} interval="preserveStartEnd"/>
                              <YAxis domain={["dataMin - 10", "dataMax + 10"]} tickCount={3 }/>
                              <Line stroke="blue" strokeWidth="3" dataKey="BOOMANGLE" dot={false} />
                              <Tooltip />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </Col> */}
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={4}>
                <div className="section-map">
                  <h5 className="heading">VESSEL OPERATIONAL STATUS</h5>
                  <MapContainer
                    key={JSON.stringify([data.position])}
                    style={{
                      width: "100%",
                      height: "849px",
                    }}
                    center={data.position}
                    zoom={14}
                    maxZoom={18}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker
                      position={data.position}
                      icon={L.icon({
                        iconUrl: "ship-64.png",
                        // shadowUrl: 'leaf-shadow.png',
                        iconSize: [30, 30], // size of the icon
                        // shadowSize:   [50, 64], // size of the shadow
                        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                        // shadowAnchor: [4, 62],  // the same for the shadow
                        popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
                      })}
                    > */}
                    <Marker position={data.position} icon={markerIcon}>
                      <Popup>
                        <span>Asset Name: Asian Hercules 2</span>
                        <br />
                        <span>Speed: {data.speed}</span>
                        <br />
                        <span>
                          Last Update: {data.time} (Singapore Standard Timezone)
                        </span>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;