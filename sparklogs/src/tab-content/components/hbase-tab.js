import React from 'react';
import axios from 'axios';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import 'antd/dist/antd.css';
import './../../index.css';
import { Button} from 'antd';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import {InfoCircleOutlined} from '@ant-design/icons';
import {notification} from 'antd';

const Notification = type => {
  notification[type]({
    message: 'Error',
    description:
      'Invalid Cluster ID',
  });
}

const Notify_dates = type => {
  notification[type]({
    message: 'Error',
    description:
      'No log files found for specified date range',
  });
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const initialState={
  loading: false,
  asyncf: true,
  res:[],
  hbase_cid: "",
  hbase_startdate:"",
  hbase_enddate: "",
  hbase_location:"",
  keyword:"",
  cid_error:"",
  startdate_error:"",
  enddate_error:"",
  location_error:"",
  resLen: 0,
  KeywordLen:0
}

class HbaseForm extends React.Component {
  state = initialState;



  mySubmitHandler = event => {
    event.preventDefault();
    const isvalid = this.validate()
    if (isvalid) {
    const params = {
      "cluster_id": this.state.hbase_cid,
      "start_date": this.state.hbase_startdate,
      "end_date": this.state.hbase_enddate,
      "keyword":this.state.keyword,
      "location":this.state.hbase_location,
      "exclusive":false
    };

    this.setState({ loading: true })
    // axios.post("https://vurh3dow5l.execute-api.us-east-1.amazonaws.com/v1/hbase",params, {
    //   headers : {
    //       "Content-Type": "application/json"  }
    // })
    // .then(response => {
    //   if(response.data.message){
    //     alert(response.data.message)}
    //     const json_out = JSON.parse(response.data.body)
    //     console.log(json_out.keyword)
    //     this.setState({loading: false, asyncf:true});
    //
    //     if(json_out.res.length==0){
    //       if(json_out.cid){
    //       Notification('error');
    //     }else{
    //       Notify_dates('error')
    //     }
    //     }
    //     else{
    //       console.log("hi")
    //     this.props.history.push({pathname:'/HbasePage2', state: {data: json_out.res,
    //       specific:json_out.specific,
    //       keyword:json_out.keyword,
    //       cluster_id: this.state.hbase_cid,
    //       start_date: this.state.hbase_startdate,
    //       end_date: this.state.hbase_enddate,
    //       keysearch:this.state.keyword,
    //       mem_limit:json_out.mem_limit
    //     }
    //     });
    //   }
    //   })
    //
    //   .catch(error => {
    //     console.log(error);
    //   })

    console.log("fetching python localhost");
    fetch("/Hbase", {
      method:"POST",
      cache: "no-cache",
      headers:{
          "content_type":"application/json",
      },
       body:JSON.stringify(params)
      }
  ).then(response => {
    // console.log(JSON.parse(response))
  return response.json()
})
   .then(json => {
     // const json_out = JSON.parse(response.data.body)
     // console.log(json_out.keyword)
     this.setState({loading: false, asyncf:true});

     if(json.res.length==0){
       if(json.cid){
       Notification('error');
     }else{
       Notify_dates('error')
     }
     }
     else{
       console.log("hi")
     this.props.history.push({pathname:'/HbasePage2', state: {data: json.res,
       specific:json.specific,
       keyword:json.keyword,
       cluster_id: this.state.hbase_cid,
       start_date: this.state.hbase_startdate,
       end_date: this.state.hbase_enddate,
       keysearch:this.state.keyword,
       location:this.state.hbase_location,
       mem_limit:json.mem_limit,
       file_name:json.file_name,
       resLen: json.resLen,
       KeywordLen:json.KeywordLen
     }
     });
   }
 console.log(json.cid)
})
    }


  };

  validate = () => {
    let cid_error="";
    let startdate_error="";
    let enddate_error="";
    let location_error="";
    let error=false;
    if(!this.state.hbase_cid)
    {
      cid_error="Please enter the Cluster ID.";
    }
    if(!this.state.hbase_startdate)
    {
      startdate_error="Please enter the Start Date.";
    }
    if(!this.state.hbase_enddate)
    {
      enddate_error="Please enter the End Date.";
    }
    if(!this.state.hbase_location)
    {
      location_error="Please enter a valid log location.";
    }
    if(cid_error||startdate_error||enddate_error||location_error)
    {
      this.setState({cid_error,startdate_error,enddate_error,location_error});
      error=true;
    }

    if(error)
    {return false;}
    return true;

  }


  myChangeHandler = event => {
    const nam = event.target.name;
    const val = event.target.value;
    this.setState({ [nam]: val });
  };


  render() {
    return (
        <form >

        <fieldset>
          <legend className="required">
            <span class="number">1</span> Cluster ID
                  </legend>
                  <input  type="text"
                  required="true"
                    id="hbase_cid"
                    name="hbase_cid"
                    className={this.state.cid_error ? "inputerror":"inputdefault"}
                    value={this.state.hbase_cid}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.cid_error}</div>
                </fieldset>
                <fieldset>
                <legend className="required">
                    <span class="number">2</span> Start Date
                  </legend>
                  <input  type="date" placeholder="YYYY-MM-DD" required="true" pattern="\d{4}-\d{1,2}-\d{1,2}"
                    id="hbase_cid"
                    name="hbase_startdate"
                    className={this.state.startdate_error ? "inputerror":"inputdefault"}
                    value={this.state.hbase_startdate}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.startdate_error}</div>
                </fieldset>
                <fieldset>
                <legend className="required">
                    <span class="number">3</span>End Date
                  </legend>
                  <input  type="date" placeholder="YYYY-MM-DD" required="true" required pattern="\d{4}-\d{1,2}-\d{1,2}"
                    id="hbase_cid"
                    name="hbase_enddate"
                    className={this.state.enddate_error ? "inputerror":"inputdefault"}
                    value={this.state.hbase_enddate}
                    onChange={this.myChangeHandler}
                  />
                  <div className="error">{this.state.enddate_error}</div>
                </fieldset>
                <fieldset>
                  <legend className="required">
                    <span class="number">4</span> Logs Location
                    <Tippy className="info" content={<span>
              PLease enter the log location without the Cluster ID</span>}>
            <InfoCircleOutlined style={{padding: 4}}/>
            </Tippy>
                          </legend>
                          <input  type="text"
                          required="true"
                            id="hbase_cid"
                            name="hbase_location"
                            className={this.state.location_error ? "inputerror":"inputdefault"}
                            value={this.state.hbase_location}
                            onChange={this.myChangeHandler}
                          />
                          <div className="error">{this.state.location_error}</div>
                        </fieldset>
                <fieldset>
                  <legend>
                    <span class="number">5</span>Search By Keyword
                    <Tippy className="info" content={<span>
              The application performs Auto Debugging.
              To search for specific keywords, please enter the keywords seperated by comma.
              Ex:Error, Fatal</span>}>
            <InfoCircleOutlined style={{padding: 4}}/>
            </Tippy>
                  </legend>
                  <input className="inputdefault" type="text" placeholder="attempts,user data"
                    id="keyword"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.myChangeHandler}
                  />
                </fieldset>
                <Button  type="primary" id="submit" onClick={this.mySubmitHandler}>
          Submit
        </Button>
        <br></br>
        <br></br>
       <BarLoader
          css={override}
          size={2000}
          width={200}
          color={"lightblue"}
          loading={this.state.loading}
        />
      </form>
    );
  }
}

export default HbaseForm;
