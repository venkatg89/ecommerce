package com.reactlibrary;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RNBnLoggerModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final String TAG = "RNBnLogger";
    private final String NAME = TAG;

    private ExecutorService executorService;
    private OutputStreamWriter outputStreamWriter;

    public RNBnLoggerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.v(TAG, "Initializing");
        this.reactContext = reactContext;
        executorService = Executors.newSingleThreadExecutor();
    }

    @ReactMethod
    public void start(String path) {
        final String pathFinal = path;
        final RNBnLoggerModule logger = this;

        executorService.submit(() -> {
            Log.v(TAG, "executorService - running start()");
            if (outputStreamWriter != null) {
                try {
                    outputStreamWriter.flush();
                } catch (IOException e) {
                    Log.w(TAG, "Unable to flush oldWriter", e);
                }
                outputStreamWriter = null; // Closes the file when garbage collector runs.
            }
             
            try {
                FileOutputStream outputStream = new FileOutputStream(pathFinal, true);
                outputStreamWriter = new OutputStreamWriter(outputStream);
              } catch (FileNotFoundException e) {
                  Log.e(TAG, " Unable to start a log file", e);
            }
        });
    }

    @ReactMethod
    public void flush() {
        executorService.submit(() -> {
            Log.v(TAG, "executorService - running flush()");
            if (outputStreamWriter != null) {
                try {
                    outputStreamWriter.flush();
                } catch (IOException e) {
                    Log.w(TAG, "Unable to flush writer as requested", e);
                }
            } else {
              Log.e(TAG, " flush() - outputStreamWriter is null");
            }
        });
    }

    @ReactMethod
    public void write(String str) {
        executorService.submit(() -> {
            Log.v(TAG, "executorService - running write()");
            if (outputStreamWriter != null) {
                try {
                    outputStreamWriter.write(str);
                } catch (IOException e) {
                    Log.w(TAG, "Unable to flush writer as requested", e);
                }
            } else {
              Log.e(TAG, " write() - outputStreamWriter is null");
            }
        });
    }

    @ReactMethod
    public void end() {
        executorService.submit(() -> {
            Log.v(TAG, "executorService - running end()");
            if (outputStreamWriter != null) {
                try {
                    outputStreamWriter.flush();
                } catch (IOException e) {
                    Log.w(TAG, "Unable to flush oldWriter", e);
                }
                outputStreamWriter = null;
            }
        });
    }

    @Override
    public String getName() {
        return NAME;
    }
}