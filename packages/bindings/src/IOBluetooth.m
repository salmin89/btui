#import "IOBluetooth.h"
#import <Foundation/Foundation.h>
#import <IOBluetooth/IOBluetooth.h>

NSMutableArray *GetServicesFromDevice(IOBluetoothDevice *device) {

  NSMutableArray *servicesDicts = [NSMutableArray array];
  for (IOBluetoothSDPServiceRecord* service in [device services]) {
    NSString *serviceName  = [service getServiceName];
    if (!serviceName) {
      continue;
    }

    NSDictionary *serviceDict = @{
      @"serviceName": serviceName,
    };

    [servicesDicts addObject:serviceDict];
  }
  return servicesDicts;
}

const char* GetAllPairedDevices() {
  // Device
  NSMutableArray *devicesArr = [NSMutableArray array];
  for (IOBluetoothDevice *device in [IOBluetoothDevice pairedDevices]) {

      NSDictionary *deviceDict = @{
          @"name": device.name ?: [NSNull null],
          @"address": device.addressString ?: [NSNull null],
          @"isConnected": @(device.isConnected),
          @"isPaired": @(device.isPaired),
          @"isFavorite": @(device.isFavorite),
          @"services": GetServicesFromDevice(device),
          // Add other properties as needed
      };
      [devicesArr addObject:deviceDict];
  }
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:devicesArr options:0 error:&error];
  
  if (!jsonData) {
      NSLog(@"Got an error: %@", error);
      return NULL;
  } else {
      return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding].UTF8String;
  }
}

const char* Connect(const char* deviceId) {
  NSString *deviceAddress = [NSString stringWithUTF8String:deviceId];
  IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString:deviceAddress];
  printf("Connecting to device %s\n", [device.name UTF8String]);
  if ([device openConnection] != kIOReturnSuccess) {
    printf("Error connecting");
  }
  return "success";
}

const char* Disconnect(const char* deviceId) {
  NSString *deviceAddress = [NSString stringWithUTF8String:deviceId];
  IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString:deviceAddress];
  printf("Disconnecting from device %s\n", [device.name UTF8String]);
  if ([device closeConnection] != kIOReturnSuccess) {
    printf("Error disconnecting");
  }
  return "success";
}

const char* AddToFavorites(const char* deviceId) {
  NSString *deviceAddress = [NSString stringWithUTF8String:deviceId];
  IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString:deviceAddress];
  printf("Adding device %s to favorites \n", [device.name UTF8String]);
  if ([device addToFavorites] != kIOReturnSuccess) {
    printf("Error adding");
  }
  return "success";
}