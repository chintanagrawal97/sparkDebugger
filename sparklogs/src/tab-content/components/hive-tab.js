import React from 'react';
import axios from 'axios';
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import 'antd/dist/antd.css';
import './../../index.css';
import { Button } from 'antd';
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import { InfoCircleOutlined } from '@ant-design/icons';
import { notification } from 'antd';

/* https://ant.design/components/notification/ 
  used to pop up when a wrong clusterID or ApplicationID is given as input. */
const Notification = type => {
  notification[type]({
    message: 'Error',
    description:
      'Invalid Cluster ID or Query ID',
  });
}


const KeywordNotification = type => {
  notification[type]({
    message: 'Warning',
    description:
      'Response Limit Exceeded. Top Keyword Search results displayed.',
    duration: 20,
  });
}

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

/* Variable to set the initial state of the state object. */
const initialState = {
  loading: false, /* loading while waiting for response */
  asyncf: true,
  response_body: [],
  all_errors: [],
  hive_cid: '', /* hive cluster id*/
  hive_qid: '', /* hive application id */
  keyword: '', /* keyword search*/
  hive_aid: ['Not Found'],
  query_path: '',/*It gives the location of the query */
  requestNotComplete: true,
  keyword_query_errors: [],/* result of keyword search */
  hiveciderror: '',/* error in hive cluster id*/
  locationerror: '',/*error in location*/
  log_location: '', /*location for logs*/
  exclusive: false,/* exclusive search from second page*/
  specific_errors: [],/* specific error*/
  specific_warnings: [],/* specific warning */
  keyword_memory: [''], /*Response limit exceded */
  resLen: 0,
  KeywordLen:0,
  flag: 0
}

class HiveForm extends React.Component {
  state = initialState; /* Setting the state with initialState variable */

  async fetchHelloWorld() {
    const params = {
      /* ClusterID, ApplicationID, Keywords for search, exclusive is a flag set to false when keyword is searched from first page.
      exclusive is set to true when keyword is searched from second keyword tab page. */
      cluster_id: this.state.hive_cid,
      query_id: this.state.hive_qid,
      keyword: this.state.keyword,
      log_location: this.state.log_location,
      exclusive: false
    };

    console.log("fetching python localhost");
    this.setState({ loading: true });
    await fetch("/Hive", {
      method:"POST",
      cache: "no-cache",
      headers:{
          "content_type":"application/json",
        },
      body:JSON.stringify(params)
    }
    ).then(response => {
        return response.json()
      })
    .then(json => {
      this.setState({response_body: json['body']});
    })
    //console.log(this.state.response_body);
    if(!this.state.response_body)
    {
      this.setState(initialState);
      Notification("error");
    }
    else
    { 
      //console.log(this.state.response_body);
      const response = JSON.parse(this.state.response_body);
      //console.log(response);
      this.setState({ all_errors: response.logs, loading: false, asyncf: true });
      //console.log(this.state.all_errors);
      this.setState({ query_path: response.query_path, loading: false, asyncf: true });
      this.setState({ keyword_query_errors: response.keyword_queries, loading: false, asyncf: true });
      this.setState({ specific_errors: response.specific_errors, loading: false, asyncf: true });
      this.setState({ specific_warnings: response.specific_warnings, loading: false, asyncf: true });
      this.setState({ keyword_memory: response.memory, loading: false, async: true });
      this.setState({KeywordLen: response.KeywordLen, loading: false, async: true});
      this.setState({resLen: response.resLen, loading: false, async: true});
      this.setState({flag: response.flag, loading: false, asyncf: true});
      
      if (response.app_ids_found !== []) {
        this.setState({ hive_aid: response.app_ids_found });
      }
      /* If proper response was received , then call newPage() for redirecting to second page */
      this.newPage();
    }
  }

  /* Function to make HTTP request to AWS Lambda through post request using AWS APIGateway */
  async MakeHTTPRequest() {
    /*  parameters to be sent along with the HTTP request. */
    const params = {
      /* ClusterID, QueryID, Keywords for search, exclusive is a flag set to false when keyword is searched from first page.
      exclusive is set to true when keyword is searched from second keyword tab page. */
      cluster_id: this.state.hive_cid,
      query_id: this.state.hive_qid,
      keyword: this.state.keyword,
      exclusive: false
    };

    this.setState({ loading: true }) /* setting loading to true until response is fetched. */
    const response = await axios
      .post(
        /* post request sent along with the parameters stored in params variable */
        'https://29h1mjrruc.execute-api.us-east-1.amazonaws.com/hive1/hive',
        params,
        {
          headers: {
            /* Setting headers */
            'Content-Type': 'application/json',
            //'access-control-allow-origin': '*',
          }
        }
      );

    if (response.data === null) /* If no response was sent then set state object to initialState and pop up the notification with error message. */ {
      this.setState(initialState);
      //alert("ClusterID / QueryID Invalid !");
      Notification("error");
    }
    else {
      const json = await JSON.parse(response.data.body); /* parsing the json response and storing it in a variable. */
      /* Setting the state object with the response data*/
      this.setState({ all_errors: json.logs, loading: false, asyncf: true });
      this.setState({ query_path: json.query_path, loading: false, asyncf: true });
      this.setState({ keyword_query_errors: json.keyword_queries, loading: false, asyncf: true });
      this.setState({ specific_errors: json.specific_errors, loading: false, asyncf: true });
      this.setState({ specific_warnings: json.specific_warnings, loading: false, asyncf: true });
      this.setState({ keyword_memory: json.memory, loading: false, async: true });
      
      if (json.app_ids_found.length >= 1) {
        this.setState({ hive_aid: json.app_ids_found });
      }
      /* If proper response was received , then call newPage() for redirecting to second page */
      this.newPage();
    }



  };

  /* Function to validate the inputs given in the form */
  validate = () => {
    let hiveciderror = "";
    let locationerror = "";
    let error = false;
    if (!this.state.hive_cid)/* Checking if Cluster ID was left empty */ 
      {
        hiveciderror = "Please enter Cluster ID.";
      }
    if(!this.state.log_location)
    {
      locationerror = "Please enter location of cluster"
    }
      if (hiveciderror || locationerror)/* If any of the required field is empty */ {
        //console.log(this.state.log_location);
        //console.log(this.state.hive_cid);
        //console.log(this.state.locationerror);
        this.setState({ hiveciderror });
        this.setState({locationerror});
        error = true;/* set error to true*/

      }

      if (error) { return false; }
      return true;
  }

  /* Function is called when the submit button is clicked*/
  mySubmitHandler = event => {
    event.preventDefault();
    const isvalid = this.validate() /* calling validate() to check the form inputs */
    if (isvalid) { /* If form inputs were valid then make the HTTP request */
      //this.MakeHTTPRequest();
      this.fetchHelloWorld();
    }


  };

  /* Function to redirect to the HivePage2 along with the json response. */
  newPage = event => {
    this.props.history.push({
      pathname: '/HivePage2', state: {
        data: this.state.all_errors,
        cluster_id: this.state.hive_cid,
        keyword: this.state.keyword,
        query_id: this.state.hive_qid,
        query_path: this.state.query_path,
        application_id: this.state.hive_aid,
        keyword_data: this.state.keyword_query_errors,
        specific_errors: this.state.specific_errors,
        specific_warnings: this.state.specific_warnings,
        keyword_memory: this.state.keyword_memory,
        log_location: this.state.log_location,
        KeywordLen: this.state.KeywordLen,
        resLen: this.state.resLen,
        flag: this.state.flag
      }
    });
  };
  /* Function to record the change in the input field and setting the latest input given by the user. */
  myChangeHandler = event => {
    const nam = event.target.name;
    const val = event.target.value.trim();
    this.setState({ [nam]: val });

  };

  browseResult(e){
    var fileselector = document.getElementById('fileselector');
    console.log(fileselector.value);
  }

  render() {
    return (
      <form>
        <fieldset>
          <legend className="required">
            <span className="number">1</span> Cluster ID
          </legend>
          <input /* Input for Cluster ID */
            type="text"
            name="hive_cid"
            className={this.state.hiveciderror ? "inputerror" : "inputdefault"}
            value={this.state.hive_cid}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.hiveciderror}</div>
        </fieldset>

        <fieldset>
          <legend className="required">
            <span className="number">2</span> Logs Location
            <Tippy /* Used for information hovering */
              className="info" content={<span>
                PLease enter the log location without the Cluster ID</span>}>
              <InfoCircleOutlined style={{ padding: 4 }} />
            </Tippy >
          </legend>
          <input /* Input for Logs location */
            type="text"
            name="log_location"
            className={this.state.locationerror ? "inputerror" : "inputdefault"}
            value={this.state.log_location}
            onChange={this.myChangeHandler}
          />
          <div /* to show error */ className="error">{this.state.locationerror}</div>
        </fieldset>

        <fieldset>
          <legend>
            <span className="number">3</span> Query ID
            </legend>
          <input /* Input for Query ID */
            type="text"
            name="hive_qid"
            className={"inputdefault"}
            value={this.state.hive_qid}
            onChange={this.myChangeHandler} />
        </fieldset>


        <fieldset>

          <legend>
            <span className="number">4</span> Search By Keyword
            <Tippy /* Used for information hovering */
              className="info" content={<span>
                The application performs Auto Debugging.
                To search for specific keywords, please enter the keywords seperated by comma.
              Ex:Error, Fatal</span>}>
              <InfoCircleOutlined style={{ padding: 4 }} />
            </Tippy >
          </legend>
          <input /* Input for keyword search */
            type="text"
            name="keyword"
            className="inputdefault"
            placeholder="insert,drop"
            value={this.state.keyword}
            onChange={this.myChangeHandler}
          />
        </fieldset>

        <Button type="primary" id="submit" onClick={this.mySubmitHandler}>
          Submit
        </Button>
        <br></br>
        <br></br>
        <BarLoader /* The loading component */
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
export default HiveForm;

