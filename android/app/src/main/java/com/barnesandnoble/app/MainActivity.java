package com.barnesandnoble.app;

import com.facebook.react.ReactActivity;

//Gesture
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
// Localytics
import android.content.Intent;
import com.localytics.android.Localytics;

import android.view.MotionEvent;


public class MainActivity extends ReactActivity {

    private Double3FingerTap double3FingerTap = new Double3FingerTap();


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "my_bn";
    }
    // Localytics
    @Override
    public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);

      Localytics.onNewIntent(this, intent);
    }
    
    @Override public boolean dispatchTouchEvent (MotionEvent event) {
        boolean double3FingerTap = this.double3FingerTap.detectMultiFingerDoubleTap(event);
        
        if (double3FingerTap) {
            try {
                // https://stackoverflow.com/questions/49153747
                ReactContext rnContext = 
                  this.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
                if (rnContext != null) {
                    rnContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                             .emit("trippletap", null);
                }
            } catch (NullPointerException e) {
              // React Context is not ready yet. Don't do anything.
            }
        }

        // Make sure we pass this event on to react native.
        return super.dispatchTouchEvent(event);
    }

        //Gestures enable(react-native-swipe-gestures)
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
