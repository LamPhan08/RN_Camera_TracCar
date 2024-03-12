package com.camera // Replace with your app's package name

import android.util.Log
import com.camera.traccar.TraccarClientBridge
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

public class TraccarModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  private val reactContext: ReactApplicationContext
  private var traccarClient: TraccarClientBridge

  init {
    reactContext = context
    traccarClient = TraccarClientBridge(reactContext)
  }

  override fun getName() = "TraccarModule"

  @ReactMethod
  fun startTrackingService() {
    Log.d("Traccar Module", reactContext.toString())
    traccarClient.startTrackingService()
  }

  @ReactMethod
  fun stopTrackingService() {
    Log.i("TRaccarModule", "Service will be destroyed")
    traccarClient.stopTrackingService()
  }

  @ReactMethod
  fun setupTrackingService(url: String, deviceId: String, interval: Int) {
    traccarClient.setupTrackingService(url, deviceId, interval)
  }

  companion object {
    const val NAME = "Traccar"
  }
}
