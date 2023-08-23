package com.barnesandnoble.app;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

public class Provider extends ContentProvider {
    static final String TAG = "com.bn.app.provider"; // ".bn" due to a tag char limit.

    static final String CREDENTIALS_SECURE_STORE_KEY = "LOGIN_CREDENTIALS";
    static final String CREDENTIALS_URL = "/credentials";

    static final String[] COLUMN_NAMES = new String[]{"email", "password"};

    static final String JSON_USERNAME_KEY = "username";
    static final String JSON_PASSWORD_KEY = "password";

    SecureStoreReader secureStoreReader;

    @Override
    public boolean onCreate() {
        this.secureStoreReader = new SecureStoreReader(getContext());
        return true;
    }

    @Override
    public String getType(Uri uri) {
        return "vnd.android.cursor.item";
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {

        if (uri.toString().endsWith(CREDENTIALS_URL))
        {
            MatrixCursor c = new MatrixCursor(COLUMN_NAMES);

            try
            {
                String json = secureStoreReader.getPlainText(CREDENTIALS_SECURE_STORE_KEY);

                JSONObject jsonObject = new JSONObject(json);
                Object[] rowData = new String[2];
                rowData[0] = jsonObject.getString(JSON_USERNAME_KEY);
                rowData[1] = jsonObject.getString("password");
                c.addRow(rowData);
            }
            catch (JSONException e)
            {
                // Either no entry found, or no data in the result.
                // Return empty set
                return c;
            }
            catch (IOException e) {
                Log.e(TAG, "IOException upon query(), returning nothing.", e);
                return c;
            }
            catch (java.security.GeneralSecurityException e) {
                Log.e(TAG, "GeneralSecurityException upon query(), returning nothing.", e);
            }

            return c;
        } else {
            throw new IllegalArgumentException("Unrecognized URI: " + uri.toString());
        }
    }


    // Mutating methods are stubs only, as this data is read only
    @Override public Uri insert(Uri uri, ContentValues values) { return null; }
    @Override public int update(Uri uri, ContentValues v, String s, String[] sA) { return 0; }
    @Override public int delete(Uri uri, String selection, String[] selectionArgs) { return 0; }
}