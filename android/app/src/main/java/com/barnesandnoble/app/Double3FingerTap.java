
package com.barnesandnoble.app;

import java.util.Date;

import android.view.MotionEvent;

public class Double3FingerTap {

    private static final int TARGET_FINGER_COUNT = 3;
    private static final int DOUBLE_TAP_DURATION = 500; // ms

    private boolean threeFingersRecognitionReady = false;
    private Date threeFingersFirstTapDone = new Date(0);

    public boolean detectMultiFingerDoubleTap(MotionEvent event) {
        int fingerCount = event.getPointerCount();

        // Reset the finger counter if all fingers are remove from screen. 
        // (It only goes down to 1 in tests). 
        if (fingerCount <= 1) {
            // We're ready to detect 3 fingers at the same time now
            this.threeFingersRecognitionReady = true;
        }    
        // If we see three fingers down
        if (this.threeFingersRecognitionReady && fingerCount == TARGET_FINGER_COUNT) {
            this.threeFingersRecognitionReady = false;
            // Check that it's been a double-tap
            if ((this.threeFingersFirstTapDone.getTime() + DOUBLE_TAP_DURATION) > 
                (new Date().getTime())) {
                this.threeFingersFirstTapDone = new Date(0);
                // Detected!
                return true;
            } else {
                // This is probably the first tap of the double-tap
                this.threeFingersFirstTapDone = new Date();
            }
        }
        
        // Not Yet Detected...
        return false;
    }
}
