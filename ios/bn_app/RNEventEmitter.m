#import "RNEventEmitter.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NSString* event_onTrippleTap = @"trippletap";

@implementation RNEventEmitter

RCT_EXPORT_MODULE(RNEventEmitter);

-(NSArray<NSString *> *)supportedEvents
{
  return @[event_onTrippleTap];
}

RCT_EXPORT_METHOD(startListening) {
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(threeFingerDoubleTap:)
                                               name:event_onTrippleTap
                                             object: nil];
}

RCT_EXPORT_METHOD(stopListening) {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  
}

-(void) threeFingerDoubleTap:(NSNotification *) notification {
  [self sendEventWithName:event_onTrippleTap body:nil];
}

@end
