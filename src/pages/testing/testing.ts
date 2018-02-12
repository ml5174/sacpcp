import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'testing.html'
})
export class TestingPage {
  serverVersionNumber: string = "1.700";
  versionNumber: string = "";
  buildNumber: string = "";
  versionString: string = "";
  serverEnv: string = "test";

  constructor(
    public nav: NavController,
    public storage: Storage) {
    console.log("Testing...");
    this.storage.get('serverVersion').then((myServerVersionNumber) => {
      this.serverVersionNumber = myServerVersionNumber;
      console.log('Server Version: ' + this.serverVersionNumber);
    });

    this.storage.get('serverEnv').then((myServerEnv) => {
       this.serverEnv = myServerEnv;
       if (this.serverEnv == "prod") {
         this.serverEnv = "";
       }
       console.log('Server Env: ' + this.serverEnv);
    });

    this.storage.get('version').then((myVersionNumber) => {
      this.versionNumber = myVersionNumber;
      console.log('Version: ' + this.versionNumber);
    });

    this.storage.get('build').then((myBuildNumber) => {
      this.buildNumber = myBuildNumber;
      console.log('Build: ' + this.buildNumber);
      this.versionString = this.versionNumber + " (" + this.buildNumber + ") ";
    });

    console.log("versionString: " + this.versionString);
  }

  back() {
    this.nav.pop();
  }

}
