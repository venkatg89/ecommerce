/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <UIKit/UITapGestureRecognizer.h>

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

//#import <GoogleMaps/GoogleMaps.h>

// Localytics
@import Localytics;
@import UserNotifications;

// React-navigation
#import <React/RCTLinkingManager.h>

// Our code
#import "RNEventEmitter.h"
//#import "ReactNativeConfig.h"

@interface AppDelegate()
@property (nonatomic) RNEventEmitter *rnEventEmitter;
@property (nonatomic) RCTBridge *bridge;
@end

@implementation AppDelegate

-(void) threeFingerDoubleTap {
  [[NSNotificationCenter defaultCenter] postNotificationName:event_onTrippleTap object:nil];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions


{

//NSString *googleApiKey = [ReactNativeConfig envFor:@"GOOGLE_API_KEY_IOS"];
//
//[GMSServices provideAPIKey:googleApiKey];

#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif
  // Localytics
  [Localytics autoIntegrate:@"e6c2a8115fea24dc22b1f7b-9d45fb32-b22f-11e9-d326-007c928ca240"
    withLocalyticsOptions:@{
                            LOCALYTICS_WIFI_UPLOAD_INTERVAL_SECONDS: @5,
                            LOCALYTICS_GREAT_NETWORK_UPLOAD_INTERVAL_SECONDS: @10,
                            LOCALYTICS_DECENT_NETWORK_UPLOAD_INTERVAL_SECONDS: @30,
                            LOCALYTICS_BAD_NETWORK_UPLOAD_INTERVAL_SECONDS: @90
                          }
            launchOptions:launchOptions];

  [application registerForRemoteNotifications];
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  
  if (NSClassFromString(@"UNUserNotificationCenter") && @available(iOS 12.0, *)) {
    UNAuthorizationOptions options = UNAuthorizationOptionProvisional;
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:options
              completionHandler:^(BOOL granted, NSError * _Nullable error) {
                  [Localytics didRequestUserNotificationAuthorizationWithOptions:options
                              granted:granted];
    }];
  }
  
  if (NSClassFromString(@"UNUserNotificationCenter")) {
    UNAuthorizationOptions options = (UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert);
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:options
                                                                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
                                                                          [Localytics didRequestUserNotificationAuthorizationWithOptions:options
                                                                                                                                 granted:granted];
                                                                        }];
  } else {
    UIUserNotificationType types = (UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound);
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
    [application registerUserNotificationSettings:settings];
  }
  
  // Set up the window
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  
  // Set up RCTBridge, use it to get an RCTRootView, and assign it to the rootViewController.
  UIViewController *rootViewController = [UIViewController new];
  self.bridge = [[RCTBridge alloc] initWithDelegate:self
                                      launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:self.bridge
                                                   moduleName:@"my_bn"
                                            initialProperties:nil];
  rootViewController.view = rootView;
  rootView.backgroundColor = [UIColor whiteColor];
  self.window.rootViewController = rootViewController;
    
  // Log Collection Tap gesture
  _rnEventEmitter = [[RNEventEmitter alloc] init];
  _rnEventEmitter.bridge = self.bridge;
  UITapGestureRecognizer* tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(threeFingerDoubleTap)];
  tapGesture.numberOfTapsRequired = 2;
  tapGesture.numberOfTouchesRequired = 3;
  [self.window addGestureRecognizer:tapGesture];

  // Show the React native window
  [self.window makeKeyAndVisible];
  
  return YES;
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler {
  [Localytics didReceiveNotificationResponseWithUserInfo:response.notification.request.content.userInfo];
  completionHandler();
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  completionHandler(UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                        fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main"
                                 withExtension:@"jsbundle"];
#endif
}

// react-navigation deep linking
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

@end

