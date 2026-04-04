package com.jxctrl.quizarena;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
        super.onStart();
        
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            
            // Set the WebView background color to match the app theme (#0A0A0F).
            // This prevents a white flash during the initial load.
            webView.setBackgroundColor(0xFF0A0A0F);
            
            // Ensure essential features are enabled for the static web app.
            settings.setDomStorageEnabled(true);
            settings.setJavaScriptEnabled(true);
        }
    }
}
