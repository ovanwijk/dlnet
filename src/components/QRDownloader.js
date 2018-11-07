import React, {Component} from 'react';
import {
   
    Card,  CardText, CardBody, CardFooter,
    CardHeader,Button
    } from 'reactstrap';
import QRCode from 'qrcode.react';

class QRDownloader extends Component {
    constructor(props){
        super(props);
       this.state ={
           size: Number(props.match.params.size),
           data: atob(props.match.params.base64),
           name:  props.match.params.name,
           stayopen: props.match.params.stayopen,
           downloaded: false
       };
  }

  componentDidMount(){
    if(this.state.downloaded === false){
        this.downloadQRCode();
        this.setState({downloaded: true})
        if(this.state.stayopen === 0 || this.state.stayopen === "0"){
            window.open('','_parent','');
            window.close();
        }
    }
  }
  

  downloadQRCode(){
    var lnk = document.createElement('a'), e;

    /// the key here is to set the download attribute of the a tag
    lnk.download = this.state.name;
  
    /// convert canvas content to data-uri for link. When download
    /// attribute is set the content pointed to by link will be
    /// pushed as "download" in HTML5 capable browsers
    var canvas = document.getElementById("qrcodeCanvas")
    lnk.href = canvas.toDataURL("image/png;base64");
  
    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false,
                       false, 0, null);
  
      lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
      lnk.fireEvent("onclick");
    }
}


    render(){
        return <div style={{display:'flex', textAlign:'center', 
            alignItems:'center', alignContent:'center',
            justifyContent:'center', width:'100%', height:'100vh'}}><Card>           
              <CardHeader>Downloading QR Code: {this.state.name}</CardHeader>
              <CardBody>
                <QRCode id="qrcodeCanvas" 
                    value={this.state.data} 
                    size={this.state.size} />
                <CardText>
                    {this.state.data} 

                </CardText>
               
              </CardBody>
              <CardFooter>
                  <Button onClick={this.downloadQRCode.bind(this)}>Download</Button>
              </CardFooter>
            
        </Card>
        </div>
              
    }
}


export { QRDownloader as default}