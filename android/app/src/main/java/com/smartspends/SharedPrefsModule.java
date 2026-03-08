package com.smartspends;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SharedPrefsModule extends ReactContextBaseJavaModule {
    private static final String PREF_NAME = "WidgetPrefs";
    private final ReactApplicationContext reactContext;

    public SharedPrefsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "SharedPrefsModule";
    }

    @ReactMethod
    public void setToken(String token) {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString("authToken", token).apply();
    }

    @ReactMethod
    public void clearToken() {
        SharedPreferences prefs = reactContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove("authToken").apply();
    }
}
