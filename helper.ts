import { ToastController } from 'ionic-angular';

export type MessageFunction = (data: any) => string;

export class Helper {
   static presentToast(toastCtrl: ToastController, data: any, fn?: MessageFunction) {
       if (fn)
           data = fn(data);
       else
           data = data != null && (!data.length || data.length > 0) ? 'The value "' + data + '" was selected' : null;

       toastCtrl.create({
           message: data != null ? data : "A null value was applied",
           duration: 3000
       }).present();
   }
}