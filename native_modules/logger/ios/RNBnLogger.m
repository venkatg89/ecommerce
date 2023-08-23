
#import "RNBnLogger.h"

const char* DISPATCH_QUEUE_NAME = "Bn Logger Serial Queue";

@interface RNBnLogger()
@property (nonatomic) NSFileManager* fileManager;   // since NSFileManager.default may not be thread safe (a bit of conflicting info out there)
@property (nonatomic) dispatch_queue_t serialQueue;
@property (nonatomic) NSFileHandle* fileHandle;
@end

@implementation RNBnLogger

-(instancetype)init
{
    self = [super init];
    if (self) {
        NSLog(@"RNBnLogger - iOS Native Module Initializing");
        _fileManager = [[NSFileManager alloc] init];
        _serialQueue = dispatch_queue_create(DISPATCH_QUEUE_NAME, DISPATCH_QUEUE_SERIAL);
    }
    return self;
}

// We don't require Main Queue-set up. Added in reponse to this error message.
/* "Module RNBnLogger requires main queue setup since it overrides `init` but doesn't implement `requiresMainQueueSetup`." */
+(BOOL)requiresMainQueueSetup {
    return FALSE;
}


RCT_EXPORT_METHOD(start:(NSString *)path) {
    __weak RNBnLogger* weakSelf = self;
    dispatch_async(self.serialQueue, ^{
        if (weakSelf.fileHandle) {
            [weakSelf.fileHandle closeFile];
            weakSelf.fileHandle = nil;
        }
        if (![weakSelf.fileManager fileExistsAtPath:path]) {
            [weakSelf.fileManager createFileAtPath:path contents:nil attributes:nil];
        }
        weakSelf.fileHandle = [NSFileHandle fileHandleForWritingAtPath:path];
        if (!weakSelf.fileHandle) {
            NSLog(@"RNBnLogger - Unable to create log file at: %@", path);
            return;
        }
        [weakSelf.fileHandle seekToEndOfFile];
    });
}

RCT_EXPORT_METHOD(flush) {
    __weak RNBnLogger* weakSelf = self;
    dispatch_async(self.serialQueue, ^{
        [weakSelf.fileHandle synchronizeFile];
    });
}

RCT_EXPORT_METHOD(write:(NSString *)str) {
    __weak RNBnLogger* weakSelf = self;
    dispatch_async(self.serialQueue, ^{
        [weakSelf.fileHandle writeData:[str dataUsingEncoding:NSUTF8StringEncoding]];
    });
}

RCT_EXPORT_METHOD(end) {
    __weak RNBnLogger* weakSelf = self;
    dispatch_async(self.serialQueue, ^{
        [weakSelf.fileHandle closeFile];
        weakSelf.fileHandle = nil;
    });
}

-(void)dealloc{
    NSLog(@"RNBnLogger - dealloc");
    [self.fileHandle synchronizeFile];
    [self.fileHandle closeFile];
    self.fileHandle = nil;
    self.serialQueue = nil;
}

// React Native generated stuff below

-(dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

@end
  
