import { Component, OnInit, NgModule } from "@angular/core";
import { ServiceService } from "../service.service";
import * as $ from "jquery";
import axios from 'axios';
import { saveAs } from 'file-saver';
//For CSV Reading Column wise
import * as path from "path";
import { parse } from 'csv-parse';


import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { FormModel } from "../model/formModel";
import { Options, LabelType } from "@angular-slider/ngx-slider";
import { environment } from "src/environments/environment";
import * as JSZip from "jszip";
import Docxtemplater from "docxtemplater";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  fileToUpload: File | null = null;
  jsonData: any = null;
  subject: any;
  skill: any = [];
  jsonDataArray: any;
  requiredSkills: any;
  skillArray: any = [];
  visitIdAcceptance: number = 1;
  visitIdRejection: number = 1;
  upperLimit: number = 1;
  lowerLimit: number = 1;
  rejection = 1;
  acceptance = 1;
  maxVisiId: number = 100;
  elementExist: boolean = false;
  selectedFiles: File[] = [];
  fileData: any;
  inputJsonDataArray: any = [];
  actuallFileData: any;
  selectable = true;
  removable = true;

  minValue: number = 40;
  maxValue: number = 70;

  minValue1: number = 0;
  maxValue1: number = 30;

  finalSelectedProfiles: any = [];
  finalReviewedProfiles: any = [];
  finalRejectedProfiles: any = [];
  allProfiles: any = [];
  select: boolean = false;
  reject: boolean = false;
  review: boolean = false;
  click = false;
  base64Data: any;

  state = {
    selectedFile: null,
    fileUploadedSuccessfully: false,
    selectedFileName: null
  }

  data = [
    {
      "id": 13,
      "context": "http://tempurl.org",
      "details": [
        {
          "name": "test1"
        },
        {
          "name": "test2"
        }
      ],
      "username": "testuser1",
      "custName": "cap1"
    },
    {
      "id": 14,
      "context": "http://tempurl.org",
      "details": [],
      "username": "testuser2",
      "custName": "cap2"
    }
  ];


  options: Options = {
    floor: 0,
    ceil: 100,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.visitIdRejection = value;
          return "<b>Profiles will be Rejected Below:</b> " + value;
        case LabelType.High:
          this.visitIdAcceptance = value;
          return "<b>Profiles will be auto selected above:</b> " + value;
        default:
          return "" + value;
      }
    },
  };

  options1: Options = {
    floor: 0,
    ceil: 30,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          this.lowerLimit = value;
          return "<b>Profiles will be Rejected Below:</b> " + value;
        case LabelType.High:
          this.upperLimit = value;
          return "<b>Profiles will be Rejected Above:</b> " + value;
        default:
          return "" + value;
      }
    },
  };
  results : string[] = [];

  primarySkills: any = [
    "Statistics",
    "Machine Learning",
    "Deep Learning",
    "R Language",
    "Python Language",
    "NLP",
    "Devops",
    "Automation",
    "iOS Developer",
    "Software Developer",
    "Integration Technologist",
    "Data Visualization",
    "Android Developer-DH",
    "BU Data Analytics",
    "Dot Net Developer-MD IDS",
    "EDAT Developer-GIS IDS",
    "Automation Full Stack Developer-GIS IDS",
    "MD IDS-GPS Business System",
    "RIDS Devops",
    "Solution Architect Infohub-MD IDS",
    "Test Engineer-DH",
  ];
  deepLearning: any = [
    "neural network",
    "keras",
    "theano",
    "face detection",
    "object detections",
    "gpu",
    "cuda",
    "lstm",
    "tensorflow",
    "pytorch",
    "artificial intelligent",
    "ai/ml",
    "ai",
    "open CV",
    "data modeling",
    "cnn",
    "rnn",
  ];
  machineLearning: any = [
    "linear regression",
    "logistic regression",
    "k mean",
    "random forests",
    "xg boost",
    "ml",
    "clustering",
    "supervised learning",
    "unsupervised learning",
    "data modeling",
    "bagging",
    "boosting",
    "knn",
    "PCA",
    "Dimensionality Reduction",
    "Time series analysis",
    "OCR"
  ];

  statistics: any = [
    "Statistical models",
    "Statistical modelling",
    "probability",
    "normal distribution",
    "Binomial distribution",
    "Bernoulli distribution",
    "statistics"
  ];
  rLanguage: any = ["r", "ggplot", "shiny", "cran", "dplyr", "plotly"];
  pythonLanguage = [
    "python",
    "flask",
    "django",
    "pandas",
    "numpy",
    "sklearn",
    "scipy",
    "matplotlib",
    "opencv",
  ];
  nlp = [
    "nlp",
    "Natural language processing",
    "topic modeling",
    "bert",
    "nltk",
    "sentiment analisys",
    "doc2vec",
    "word2vec",
    "spacy",
    "NER",
    "Name entity recognition",
    "transformers",
    "pytorch",
    "lstm",
    "bi-lstm",
  ];
  devops = [
    "aws",
    "ec2",
    "s3",
    "scala",
    "hive",
    "azure",
    "ci/cd",
    "devops",
    "spark",
    "GCP",
    "Hadoop",
    "Sagemaker",
    "Jenkins",
    "Git",
    "Github",
    "SNS",
    "Athena",
    "Pig",
    "SQL",
    "lambda",
    "Terraform",
    "Github Actions",
    "Kubernetes",
    "Docker",
    "AWS Codepipeline",
    "Ansible",
    "Cloudformation",
    "AWS Code deploy",
    "JIRA",
    "ServiceNow",
    "MySQL",
    "MongoDB",
    "Postgres",
    "CosmosDB",
    "Agile",
    "SAP",
    "Excel",
    "XML",
    "RestAPI",
    "Oracle",
    "PL/SQL",
    "cloud security"
  ];
  required_skills: any = ["devops", "ci/cd", "aws", "azure", "python", "ai"];
  automation = [
    "Typescript",
    "JavaScript",
    "RestAssured",
    "OOP",
    "Object Oriented Programming",
    "OOPs",
    "Rest Assured",
    "Postman",
    "TestNG",
    "JMeter",
    "Parasoft",
    "Androidstudio",
    "Sauce labs",
    "Selenium",
    "XCode",
    "VSCode",
    "Appium",
    "Cucumber",
    "Protractor",
    "Node.js",
    "RestAPI",
    "Android studio"
  ];
  iosDeveloper = [
    "Apple mobile platforms",
    "Swift",
    "iOS",
    "Core Bluetooth",
    "Core Data",
    "Core Animation",
    "iOS SDK",
    "C",
    "C++",
    "Object Oriented Programming",
    "OOPs",
    "OOP",
    "Rest API",
    "RestAPI",
    "MVVM",
    "Cocoa Touch",
    "UI/UX",
    "IoT",
    "Core ML"
  ];
  softwareDeveloper= [
    "EC2",
    "EBS",
    "S3",
    "Lambda",
    "RDS",
    "VPC",
    "KMS",
    "API Gateway",
    "Cloudfront",
    "HapiJS",
    "Nodejs",
    "React",
    "Vue",
    "Vuejs",
    "HTML5",
    "Karma",
    "Jasmine",
    "CSS3",
    "CSS",
    "Database",
    "RDBMS",
    "Heroku",
    "OpenShift",
    "Cloud Foundry",
    "Swagger",
    "Microservices",
    "OpenID Connect",
    "Sequelize",
    "ORM",
    "Microservice Discovery"
  ];
  integrationTechnologist =[
    "Mulesoft",
    "AWS",
    "SOA",
    "EAI",
    "Informatica",
    "Soap UI",
    "Postman",
    "Salesforce",
    "JSON",
    "SSL",
    "UNIX",
  ];

  dataVisualization =[
    "storytelling",
    "power bi",
    "infographic",
    "tableau",
    "ms office",
    "ms office suite",
    "sql",
    "graphic design",
  ];
  androidDeveloper =[
    "kotlin",
    "java",
    "android",
    "tensorflow lite",
    "aar",
    "mvvm",
    "iot",
    "app store",
  ];
  
  dataAnalytics =[];
  dotNetDeveloper =[
    ".net",
    "visual studio",
    "oracle",
    "pl/sql",
    "itil",
    "dotconnect",
    "kendo",
    "asp.net",
    "rds",
    "dynamodb",
    "sketch",
    "invision",
    "adobe creative suite",  
  ];
  
  fullStackDeveloper =[
    "javascript",
    "node.js",
    "express.js",
    "passport.js",
    "vue",
    "react",
    "gulp",
    "mocha",
    "html5",
    "css3",
    "heroku",
    "openshift",
    "cloud foundry",
    "sonar",
    "redis",
    "cassandra",
    "mongo",
    "rabbitmq",
    "kafka",
    "swagger",
    "elastic search",  
  ];
  
  edat =[
    "graphql",
    "golang",
    "scrum",
    "kanban",
    "google aks",
    "amazon eks", 
  ];
  
  gpsBusinessSystem =[
    "itil",
    "pl/sql",
    "argus",
    "empirica",
    "power bi",
    "power automate",
    "macros",
    "vbscript",
    "tableau",  
  ];
  ridsDeveloper =[];
  solutionArchitectIDS =[];
  testEngineer =[];
  andriodDeveloper=[];
  
  fileNameArray: any;

  default = this.primarySkills[0];

  jobRole = [
    { id: 0, name: "MD IDS - Insights Developers" },
    { id: 1, name: "MD IDS - Microservices" },
    { id: 2, name: "BU IDS - Data Engineers" },
    { id: 3, name: "Research IDS -Software Engineer" },
    { id: 4, name: "MD IDS - Data Engineer" },
    { id: 5, name: "Research IDS - Sr. Data Scientist" },
    { id: 6, name: "GIS IDS - DevOps Engineer" },
    { id: 7, name: "AADS - Devops" },
    { id: 8, name: "Automation Engineer" },
    { id: 9, name: "Full Stack Developer" },
    { id: 10, name: "Integration Technologist" },
    { id: 11, name: "iOS Developer" },
    { id: 12, name: "Data Visualization" },
    { id: 13, name: "Android Developer-DH" },
    { id: 14, name: "BU Data Analytics" },
    { id: 15, name: "Dot Net Developer-MD IDS" },
    { id: 16, name: "EDAT Developer-GIS IDS" },
    { id: 17, name: "Automation Full Stack Developer-GIS IDS" },
    { id: 18, name: "MD IDS-GPS Business System" },
    { id: 19, name: "RIDS Devops" },
    { id: 20, name: "Solution Architect Infohub-MD IDS" },
    { id: 21, name: "Test Engineer-DH" },
  ];
  selectedOption: any = null;
  fileUploaded: any;
  nameOffileUploaded: any;
  processCompleted: string = "Yes";
  processCompletedResume: string = "Yes";
  processFileCompleted: string = "Yes";
  enableDownload: string = "No";
  fileName: any;
  pdfUrl: string | ArrayBuffer | null = "";
  uploadedFileName: any;
  fileType: string = "";
  dataMap: Map<any, any> = new Map();
  resumeNameToDisplayInUI: any;
  counter: number = 0;
  totalNoOfFiles: any;
  fileToDownload: string = "";
  resumeUploadComplete: string = "No";
  failedFileListArray: any;
  passedFileListArray: any;
  profileType: string="";
  percentage: any=0;
  passedFileListArrayCount: any;


  // contactForm = new FormGroup({
  //   subject: new FormControl(),
  //   skill: new FormControl(),
  // });

  constructor(private apiService: ServiceService) { }

  ngOnInit(): void { 
    
  }

  
  sliderChaneEvent(event: any) {
    console.log("Slider call");
    console.log(event.pointerType);
    this.processFile(event);
  }

  fileChange(event: any) {
    console.log();
  }

  async onClickSubmit(result: any) {
    this.jsonDataArray = [];
    this.resumeNameToDisplayInUI = "";
    this.counter = 0;
    this.processFileCompleted = "No";
    this.enableDownload = "No";
    console.log("You have entered : " + result.subject);
    console.log("You have entered : " + result.skill);
    console.log("Skill Array : " + this.skillArray);
    // $("#main2").get(0).scrollIntoView();
    console.log("##########Job Role selected###########");
    console.log(this.selectedOption);
    this.finalSelectedProfiles = [];
    this.finalRejectedProfiles = [];
    this.finalReviewedProfiles = [];

    let formData = new FormModel();
    formData.subject = result.subject;
    formData.skill = this.skillArray;
    formData.acceptanceThreshold = this.visitIdAcceptance;
    formData.rejectionThreshold = this.visitIdRejection;
    //formData.names = this.fileNameArray;
    formData.upperLimit = this.upperLimit;
    formData.lowerLimit = this.lowerLimit;
    formData.jobRole = this.selectedOption;
    this.totalNoOfFiles = this.fileNameArray.length;
    for (let index = 0; index < this.fileNameArray.length; index++) {
      const element = this.fileNameArray[index];

      formData.names.push(element);
      this.resumeNameToDisplayInUI = element;
      console.log(
        "form Object need to send to backend:" + JSON.stringify(formData)
      );

      await axios.post(environment.hostUrl, JSON.stringify(formData), {
        headers: {
          'X-Amzn-SageMaker-Custom-Attributes': 'predict',
          'Content-Type': 'application/json',
          'authorizationToken':'resumeScreen3453'
        },
        // params: { name: fileName },
      }).then(res => {
        console.log('SUCCESS from BACKEND!!');
        formData.names = [];
        console.log(res);
        this.counter++;
        //this.jsonDataArray.push(res.data.profiles[0]);
        this.segregateProfile(res.data.profiles[0]);
      }).catch(err => {
        console.log('FAILURE!!');
        formData.names = [];
        console.log(err.response);
      });

    }

    console.log("Profiles segregated based on Model Performance");
    this.processFileCompleted = "Yes";
    this.enableDownload = "Yes";
    //this.segregateProfile(this.jsonDataArray);



    // this.apiService.callBackend(JSON.stringify(formData)).subscribe(
    //   (res) => {
    //     console.log("Response from flask server");
    //     console.log(res.profiles);
    //     this.jsonDataArray = res.profiles;
    //     console.log("Profiles segregated based on Model Performance");
    //     this.segregateProfile(this.jsonDataArray);
    //   },
    //   (err) => {
    //     console.log("failure in calling backend api");
    //   }
    // );
  }

  processFile(event: any) {
    if (event.pointerType == undefined) {
      this.fileNameArray = [];
      console.log("No of Files");
      console.log(event.target.files);
      var allFiles: any = event.target.files;
      for (let index = 0; index < allFiles.length; index++) {
        this.fileNameArray.push(allFiles[index].name);
      }
      console.log(this.fileNameArray);
      //this.multipleCvUpload(this.fileNameArray);
    }

    //this.jsonDataArray = this.jsonData.default.profiles;
    //this.segregateProfile(this.jsonDataArray);
  }

  multipleCvUpload(fileArray: any) {
    this.apiService.uploadFile(fileArray).subscribe(
      (res) => {
        console.log("response after multiple CV upload");
        //console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  segregateProfile(singleProfile: any) {
    //collect data after each file process respose from backend
    //finalSelectedProfiles , finalRejectedProfiles , finalReviewedProfiles need to be cleared after each call
    this.jsonDataArray.push(singleProfile);
    this.allProfiles = [];
    this.finalSelectedProfiles = [];
    this.finalRejectedProfiles = [];
    this.finalReviewedProfiles = [];
    this.profileType="";

    for (let index = 0; index < this.jsonDataArray.length; index++) {
      const element = this.jsonDataArray[index];
      this.allProfiles.push(element);
      if (
        Number(element.approve) > this.visitIdAcceptance &&
        element.experience != "Not Found" &&
        this.lowerLimit <= Number(element.experience) &&
        Number(element.experience) <= this.upperLimit
      ) {
        this.finalSelectedProfiles.push(element);
        this.profileSelectedToggle("Selected Profile");
      } else if (Number(element.approve) < this.visitIdRejection  && element.experience != "Not Found") {
        this.finalRejectedProfiles.push(element);
        this.profileSelectedToggle("Rejected Profile");
      } else if (element.experience == -1 || element.experience == "Not Found") {
        this.finalReviewedProfiles.push(element);
        this.profileSelectedToggle("Reviewed Profile");
      } else {
        this.finalRejectedProfiles.push(element);
        this.profileSelectedToggle("Rejected Profile");
      }
    }

    console.log("finalSelectedProfiles");
    console.log(this.finalSelectedProfiles);
    console.log("finalRejectedProfiles");
    console.log(this.finalRejectedProfiles);
    console.log("finalReviewedProfiles");
    console.log(this.finalReviewedProfiles);
    // $("#eval").prop("disabled", false);
  }

  profileSelected(event: any) {
    console.log("Profile Segregate Event Triggered")
    console.log(event.target.innerHTML);
    var profile = event.target.innerHTML;
    this.profileSelectedToggle(profile.trim());
  }

  profileSelectedToggle(profile: string) {
    this.select = false;
    this.reject = false;
    this.review = false;
    switch (profile) {
      case "Selected Profile": {
        this.select = true;
        this.reject = false;
        this.review = false;
        this.profileType="Selected Profiles";
        console.log("Selected Profile clicked");

        break;
      }
      case "Rejected Profile": {
        this.select = false;
        this.reject = true;
        this.review = false;
        this.profileType="Rejected Profiles";
        console.log("Rejected Profile clicked");
        break;
      }
      case "Reviewed Profile": {
        this.select = false;
        this.reject = false;
        this.review = true;
        this.profileType="Reviewed Profiles";
        console.log("Reviewed Profile clicked");
        break;
      }
      default: {
        //statements;
        break;
      }
    }

    console.log(this.select, this.review, this.reject);
  }

  readURL(event: any) {
    var url_path = event.target.value;
    console.log(url_path);
    fetch(url_path)
      .then((r) => r.blob())
      .then((blob) => {
        this.readFileJobDescription(<File>blob);
      });
  }

  //Tapan
  onfileChanged(event: any, uploadType: string) {
    this.fileType = "";
    this.percentage=0;
    this.resumeUploadComplete = "No";
    if (uploadType == 'description') {
      this.jdUploaded(event);
    }

    //Type of file "JD" or "Resume" to upload to s3
    console.log("############### Resume Upload Start ##############################")
    this.fileType = uploadType;
    this.fileUploaded = event.target.files;
    console.log(this.fileUploaded);
    console.log("file Name = " + this.nameOffileUploaded);
    console.log("File ready to upload to s3");
    if (this.fileType == 'description')
      this.processCompleted = "No";
    if (this.fileType == 'resume')
      this.processCompletedResume = "No";
    this.onFileUpload(uploadType);

    console.log("############### Resume Upload End ##############################")

    if (uploadType == 'resume') {
      this.resumeUploaded(event);
      this.processFile(event);
    }

  }

  //Tapan all files
  async onFileUpload(uploadType: string) {
    this.dataMap = new Map<any, any>();
    let count = this.fileUploaded.length;
    for (let index = 0; index < this.fileUploaded.length; index++) {
      let element = this.fileUploaded[index];
      console.log("Single file");
      console.log(element);
      this.uploadedFileName = element.name;
      console.log("File Name");
      console.log(this.uploadedFileName);
      let reader: FileReader = new FileReader();
      var baseString;
      let _this = this;


      reader.onloadend = function () {
        baseString = reader.result;
        // console.log("baseString");
        // console.log(baseString);
        _this.actuallFileData = baseString;
        console.log("##############################################");
        console.log(_this.fileType);
        console.log("##############################################");
        _this.dataMap.set(element.name, baseString);
        //Call this method out side load method
        //_this.printDta(baseString, _this.fileType);
        console.log("baseString to be uploaded");
        //console.log(element.name);
        console.log(element.name);
        if (!--count) {
          _this.printDta(_this.dataMap);
        }
      };
      reader.readAsDataURL(element);
      // await this.callBackend(element, uploadType);
    }



  }
  async printDta(dataMap: any) {
    if (this.fileType == 'description')
      this.processCompleted = "No";
    if (this.fileType == 'resume')
      this.processCompletedResume = "No";
    let newDta;
    this.failedFileListArray=[];
    this.passedFileListArray=[];
    let mapSize= dataMap.size;
    let count =0;
    for (let key of dataMap.keys()) {
      
      console.log("Map key");
      console.log(key);
      let fileName = key;
      console.log("Map Values");
      // console.log(dataMap.get(key));
      newDta = dataMap.get(key).split(";base64,")[1];
      await this.callBackend(newDta, this.fileType, fileName);
      count = count+1;
      this.percentage= (count/mapSize)*100;
    }
    if (this.fileType == 'description')
      this.processCompleted = "Yes";
    if (this.fileType == 'resume')
      this.processCompletedResume = "Yes";
    console.log("All files Uploaded Successfully");
    if (this.fileType == 'resume' && this.processCompletedResume == "Yes")
      this.resumeUploadComplete = "Yes"


  }





  async callBackend(fileUploaded: any, uploadType: string, fileName: any) {
    console.log("Upload to s3 file method Called");
    

    const formData = new FormData();
    formData.append("body", fileUploaded);
    let url = "";
    if (uploadType == 'resume') {
      url = environment.resumeUploadUrl;
      console.log("URL:" + url);
    }
    else if (uploadType == 'description') {
      url = environment.jobDescriptionUrl;
      console.log("URL:" + url);
    }
    else {

    }
    await axios.post(url, fileUploaded, {
      headers: {
        'Content-Type': 'text/plain',
        'authorizationToken':'resumeScreen3453'
      },
      params: { name: fileName },
    }).then(res => {
      console.log('File upload to S3 SUCCESS!!');
      this.passedFileListArray.push(fileName);
      console.log(res);
    }).catch(err => {
      console.log('File upload to S3 FAILURE!!');
      console.log(err.response);
      this.failedFileListArray.push(fileName);
    });

    this.passedFileListArrayCount =this.passedFileListArray.length;

    console.log("################Upload to s3 End#################");
  }



  async getFileFroms3(fileName: any) {
    this.fileToDownload = "";
    this.fileToDownload = fileName;

    await axios.get(environment.retriveResumeFromS3, {
      headers: {
        'authorizationToken':'resumeScreen3453'
      },
      params: { name: fileName },
    }).then(res => {
      console.log('SUCCESS!!');
      console.log(res);
      console.log(res.data);
      this.downloadFile(res.data);
    }).catch(err => {
      console.log('FAILURE!!');
      console.log(err.response);
    });
  }

  // saveFile() {
  //   const blob = new Blob(["Please Save Me!"],{ type: "text/plain;charset=utf-8" });
  //   saveAs(blob, "save-me.txt");
  // }

  downloadFile(b64encodedString: string) {
    if (b64encodedString) {
      var blob = this.base64ToBlob(b64encodedString, 'text/plain');
      saveAs(blob, this.fileToDownload);
    }
  }

  public base64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }




  jdUploaded(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        var validExts = new Array(".docx");
        var fileExt = event.target.files[i].name;

        fileExt = fileExt.substring(fileExt.lastIndexOf("."));
        console.log(fileExt);
        if (validExts.indexOf(fileExt) < 0) {
          alert(
            "Invalid file selected, valid files are of " +
            validExts.toString() +
            " types."
          );
          break;
        }
        this.readFileJobDescription(<File>event.target.files[i]);

        // console.log(this.colorControl.value);
      }
    }
  }

  resumeUploaded(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        var validExts = new Array(".docx,.pdf,.doc");
        var fileExt = event.target.files[i].name;

        fileExt = fileExt.substring(fileExt.lastIndexOf("."));
        console.log(fileExt);
        if (fileExt == ".docx" || fileExt == ".pdf" || fileExt == ".doc") {
         
        }
        else{
          alert(
            "Invalid file selected, valid files are of " +
            validExts.toString() +
            " types."
          );
          break;
        }
        this.readFileResume(<File>event.target.files[i]);

        
      }
    }
  }

  uploadFileToBackend(data: any) {
    this.apiService.uploadFileToBackend(data).subscribe(
      (res: any) => {
        console.log("Response from flask server");
        console.log(res);
        this.required_skills = [];
        this.required_skills = res.required_skills;
        if (this.required_skills != null && this.required_skills.length > 0) {
          for (let index = 0; index < this.required_skills.length; index++) {
            //const element = this.required_skills[index];
            this.skillArray.push(this.required_skills[index]);
          }
        }
        console.log("this.skillArray");
        console.log(this.skillArray);
      },
      (err: any) => {
        console.log("failure in calling backend api");
        // for (let index = 0; index < this.required_skills.length; index++) {
        //   //const element = this.required_skills[index];
        //   this.skillArray.push(this.required_skills[index]);

        // }
      }
    );
  }

  uploadFilesToS3(data: any, fileName: any) {
    this.apiService.uploadS3(data, fileName).subscribe(
      (res: any) => {
        console.log("Uploaded Files to s3 successfully");
      },
      (err: any) => {
        console.log("failure in calling backend api");

      }
    );
  }

  readFileJobDescription(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      console.log("File:");
      console.log(file);
      console.log(file.name);
      console.log("@@@@@ calling to /predictresume api @@@@@@@@@@@@@@@@ ");
      this.uploadFileToBackend(file.name);
    };
    reader.readAsText(file);
  }

  readFileResume(file: File) {
    var reader = new FileReader();
    reader.onload = () => {
      console.log("File:");
      console.log(file);
      console.log(file.name);
      //console.log("@@@@@ calling to /predictresume api @@@@@@@@@@@@@@@@ ");
      //this.uploadFileToBackend(file.name);
    };
    reader.readAsText(file);
  }

  saveDetails() {
    for (let index = 0; index < this.inputJsonDataArray.length; index++) {
      console.log(JSON.stringify(this.inputJsonDataArray));
    }
  }

  // onSubmit() {
  //   console.log(this.contactForm.value);
  //   this.apiService.callBackend(this.contactForm.value).subscribe(
  //     (res) => {
  //       console.log("Response from flask server");
  //       console.log(res.profiles);
  //       this.jsonDataArray=res.profiles;
  //     },
  //     (err) => {
  //       console.log("failure in calling backend api");
  //     });
  // }

  changeSuit(e: any) {
    console.log(e.source.triggerValue);
    this.subject = e.source.triggerValue;

    // var er = document.getElementById("suit_drpdown")!.value;
    // console.log(er);

    if (e.source.triggerValue === "Deep Learning") {
      this.requiredSkills = this.deepLearning;
    } else if (e.source.triggerValue === "Machine Learning") {
      this.requiredSkills = this.machineLearning;
    } else if (e.source.triggerValue === "Statistics") {
      this.requiredSkills = this.statistics;
    } else if (e.source.triggerValue === "R Language") {
      this.requiredSkills = this.rLanguage;
    } else if (e.source.triggerValue === "Python Language") {
      this.requiredSkills = this.nlp;
    } else if (e.source.triggerValue === "NLP") {
      this.requiredSkills = this.machineLearning;
    } else if (e.source.triggerValue === "Devops") {
      this.requiredSkills = this.devops;
    } else if (e.source.triggerValue === "Automation") {
      this.requiredSkills = this.automation;
    } else if (e.source.triggerValue === "iOS Developer") {
      this.requiredSkills = this.iosDeveloper;
    } else if (e.source.triggerValue === "Software Developer") {
      this.requiredSkills = this.softwareDeveloper;
    } else if (e.source.triggerValue === "Integration Technologist") {
      this.requiredSkills = this.integrationTechnologist;
    } else if (e.source.triggerValue === "Data Visualization") {
      this.requiredSkills = this.dataVisualization;
    } else if (e.source.triggerValue === "Android Developer-DH") {
      this.requiredSkills = this.andriodDeveloper;
    } else if (e.source.triggerValue === "BU Data Analytics") {
      this.requiredSkills = this.dataAnalytics;
    } else if (e.source.triggerValue === "Dot Net Developer-MD IDS") {
      this.requiredSkills = this.dotNetDeveloper;
    } else if (e.source.triggerValue === "EDAT Developer-GIS IDS") {
      this.requiredSkills = this.edat;
    } else if (e.source.triggerValue === "Automation Full Stack Developer-GIS IDS") {
      this.requiredSkills = this.fullStackDeveloper;
    } else if (e.source.triggerValue === "MD IDS-GPS Business System") {
      this.requiredSkills = this.gpsBusinessSystem;
    } else if (e.source.triggerValue === "RIDS Devops") {
      this.requiredSkills = this.ridsDeveloper;
    } else if (e.source.triggerValue === "Solution Architect Infohub-MD IDS") {
      this.requiredSkills = this.solutionArchitectIDS;
    } else if (e.source.triggerValue === "Test Engineer-DH") {
      this.requiredSkills = this.testEngineer;
    } else this.requiredSkills = [];
    
    // console.log(this.colorControl.value);
  }

  checkCheckBoxvalue(event: any, skill: any) {
    console.log(event.checked);
    console.log(skill);
    this.elementExist = false;
    if (event.checked == true) {
      for (let index = 0; index < this.skillArray.length; index++) {
        if (this.skillArray[index] == skill) {
          this.elementExist = true;
          break;
        }
      }
      if (this.elementExist == false) this.skillArray.push(skill);
    } else {
      for (let index = 0; index < this.skillArray.length; index++) {
        if (this.skillArray[index] == skill) {
          this.skillArray.splice(index, 1);
        }
      }
    }
    console.log(this.skillArray);
    this.skill = this.skillArray;
  }

  downloadEvent(event: any) {
    console.log(event.target.parentNode.parentNode.firstElementChild.innerHTML);
    let fileName = event.target.parentNode.parentNode.firstElementChild.innerHTML;
    this.getFileFroms3(fileName);


  }

  download(profileType: any) {
    let fileName = profileType + '.csv';
    let columnNames = ["name", "experience", "identified_skills", "filename", "insight", "patent", "reject", "skill_score", "certification_score", "subject_score", "status", "approve"];
    let header = columnNames.join(',');

    let csv = header;
    csv += '\r\n';



    switch (profileType) {
      
      case "allProfiles": {
        var insights: null;
        var identfied_skills: null;
        this.allProfiles.map((c: { [x: string]: any; }) => {
          if (c["insight"] != undefined) {
            insights = c["insight"].replaceAll(',','').replaceAll('\n',' ');
            identfied_skills = c["identified_skills"].replaceAll('\n', '').replaceAll(',', '');
            console.log(insights);
            console.log("insights");
          }
          csv += [c["name"], c["experience"],identfied_skills , c["filename"], insights, c["patent"], c["reject"], c["skill_score"], c["certification_score"], c["subject_score"], c["status"], c["approve"]].join(',');
          csv += '\r\n';
        })
      }
      break;
      case "finalSelectedProfiles": {
        var insights: null;
        var identfied_skills: null;
        this.finalSelectedProfiles.map((c: { [x: string]: any; }) => {
          if (c["insight"] != undefined) {
            insights = c["insight"].replaceAll(',','').replaceAll('\n',' ');
            identfied_skills = c["identified_skills"].replaceAll('\n', '').replaceAll(',', '');
            console.log(insights);
            console.log("insights");
          }
          csv += [c["name"], c["experience"],identfied_skills , c["filename"], insights, c["patent"], c["reject"], c["skill_score"], c["certification_score"], c["subject_score"], c["status"], c["approve"]].join(',');
          csv += '\r\n';
        })
      }

        break;
      case "finalRejectedProfiles":{
        var insights: null;
        this.finalRejectedProfiles.map((c: { [x: string]: any; }) => {
          if (c["insight"] != undefined) {
            insights = c["insight"].replaceAll(',','').replaceAll('\n',' ');
            identfied_skills = c["identified_skills"].replaceAll('\n', '').replaceAll(',', '');
            console.log(insights);
            console.log("insights");
          }
          csv += [c["name"], c["experience"], identfied_skills, c["filename"], insights, c["patent"], c["reject"], c["skill_score"], c["certification_score"], c["subject_score"], c["status"], c["approve"]].join(',');
          csv += '\r\n';
        })

      }

        break;
      case "finalReviewedProfiles":{
        var insights: null;
        this.finalReviewedProfiles.map((c: { [x: string]: any; }) => {
          if (c["insight"] != undefined) {
            insights = c["insight"].replaceAll(',','').replaceAll('\n',' ');
            identfied_skills = c["identified_skills"].replaceAll('\n', '').replaceAll(',', '');
            console.log(insights);
            console.log("insights");
          }
          csv += [c["name"], c["experience"], identfied_skills, c["filename"], insights, c["patent"], c["reject"], c["skill_score"], c["certification_score"], c["subject_score"], c["status"], c["approve"]].join(',');
          csv += '\r\n';
        })

      }

        break;


      default:
        console.log("No profile selected");

    }

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  acceptanceT(event: any) {
    this.visitIdAcceptance = event.value;
  }
  rejectionT(event: any) {
    this.visitIdRejection = event.value;
  }
}

$(document).ready(function () {
  var navListItems = $("div.setup-panel div a"),
    allWells = $(".setup-content"),
    allNextBtn = $(".nextBtn"),
    allPrevBtn = $(".prevBtn");
  // console.log(this.colorControl.value);
  // $("#suit_drpdown").trigger("onchange");

  allWells.hide();

  navListItems.click(function (e) {
    e.preventDefault();
    var $targethref = "" + $(this).attr("href"),
      $item = $(this);
    var $target = $($targethref);

    if (!$item.hasClass("disabled")) {
      navListItems.removeClass("btn-primary").addClass("btn-default");
      $item.addClass("btn-primary");
      allWells.hide();
      $target.show();
      $target.find("input:eq(0)").focus();
    }
  });

  allPrevBtn.click(function () {
    var curStep = $(this).closest(".setup-content"),
      curStepBtn = curStep.attr("id"),
      prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]')
        .parent()
        .prev()
        .children("a");

    prevStepWizard.removeAttr("disabled").trigger("click");
  });

  allNextBtn.click(function () {
    var curStep = $(this).closest(".setup-content"),
      curStepBtn = curStep.attr("id"),
      nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]')
        .parent()
        .next()
        .children("a"),
      curInputs = curStep.find("input[type='text'],input[type='url']"),
      isValid = true;

    // $(".form-group").removeClass("has-error");
    // for (var i = 0; i < curInputs.length; i++) {
    //   if (!curInputs[i].validity.valid) {
    //     isValid = false;
    //     $(curInputs[i]).closest(".form-group").addClass("has-error");
    //   }
    // }

    if (isValid) nextStepWizard.removeAttr("disabled").trigger("click");
  });

  $("div.setup-panel div a.btn-primary").trigger("click");
});
function onFileUpload() {
  throw new Error("Function not implemented.");
}

function csv(arg0: { headers: boolean; skipLines: number; }): any {
  throw new Error("Function not implemented.");
}

