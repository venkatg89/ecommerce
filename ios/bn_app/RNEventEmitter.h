#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

extern NSString* event_onTrippleTap;

NS_ASSUME_NONNULL_BEGIN

@interface RNEventEmitter : RCTEventEmitter <RCTBridgeModule>
@end

NS_ASSUME_NONNULL_END
