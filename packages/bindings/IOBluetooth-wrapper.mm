#include <nan.h>
#import <IOBluetooth/IOBluetooth.h>

// serialize
NSString *asJson(NSArray *array) {
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:array options:NSJSONWritingPrettyPrinted error:&error];
  NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  return jsonString;
}

// Function to get device properties
NSMutableDictionary *getDeviceProperties(IOBluetoothDevice *device) {
  NSMutableDictionary *deviceDictionary = [NSMutableDictionary dictionaryWithDictionary:@{
        @"addressString": [device addressString],
        @"isHandsFreeAudioGateway": @([device isHandsFreeAudioGateway]),
        @"isHandsFreeDevice": @([device isHandsFreeDevice]),
        @"name": [device name],
        @"nameOrAddress": [device nameOrAddress],
        @"servicesCount": @([[device services] count]),
      }];
  return deviceDictionary;
}

// Function to get service properties
NSMutableArray *getServiceProperties(NSArray *services) {
    NSMutableArray *servicesAsDictionaries = [NSMutableArray array];
    for (IOBluetoothSDPServiceRecord *service in services) {
      // return if no service name
      NSString *serviceName = [service valueForKey:@"ServiceName"];
      if (!serviceName) {
        continue;
      }

      NSDictionary *serviceDictionary = @{
      @"serviceName": serviceName,
      };

      [servicesAsDictionaries addObject:serviceDictionary];
    }

    // ... (code to get service properties and add them to servicesAsDictionaries)
    return servicesAsDictionaries;
}

NSMutableArray *getDevices() {
  NSError *error;

  NSArray *pairedDevices = [IOBluetoothDevice pairedDevices];
  NSMutableArray *devicesAsDictionaries = [NSMutableArray array];

  for (IOBluetoothDevice *device in pairedDevices) {
      NSMutableDictionary *deviceDictionary = getDeviceProperties(device);
      deviceDictionary[@"services"] = getServiceProperties([device services]);
      [devicesAsDictionaries addObject:deviceDictionary];
  }

  return devicesAsDictionaries;
}

void GetDevices(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();
  
  NSMutableArray *devices = getDevices();
  NSString *jsonString = asJson(devices);

  v8::Isolate* isolate = v8::Isolate::GetCurrent();
  v8::Local<v8::String> result = v8::String::NewFromUtf8(isolate, [jsonString UTF8String]).ToLocalChecked();

  info.GetReturnValue().Set(result);
}

void GetPaired(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

  NSMutableArray *devices = getDevices();
  NSString *jsonString = asJson(devices);

  v8::Isolate* isolate = v8::Isolate::GetCurrent();
  v8::Local<v8::String> result = v8::String::NewFromUtf8(isolate, [jsonString UTF8String]).ToLocalChecked();

  info.GetReturnValue().Set(result);
}

void MyConnect(NSString *deviceAddress) {
  NSArray *pairedDevices = [IOBluetoothDevice pairedDevices];
  IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString: deviceAddress];

  printf("Connecting to device\n");
  if ([device openConnection] != kIOReturnSuccess) {
    printf("Error connecting");
  }
}

void MyDisconnect(NSString *deviceAddress) {
  NSArray *pairedDevices = [IOBluetoothDevice pairedDevices];
  IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString: deviceAddress];

  if ([device isConnected]) {
    printf("Device is connected\n");
    printf("disconnecting!\n");

    if ([device closeConnection] != kIOReturnSuccess) {
      printf("Error disconnecting");
    }
  }
}

void Connect(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Isolate* isolate = info.GetIsolate();
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }
  // get string from arg
  v8::String::Utf8Value arg(isolate, info[0]->ToString(context).ToLocalChecked());
  std::string argValue(*arg);
  v8::Local<v8::String> returnValue = v8::String::NewFromUtf8(isolate, argValue.c_str()).ToLocalChecked();
  
  NSString *deviceAddress = [NSString stringWithUTF8String:argValue.c_str()];
  MyConnect(deviceAddress);

  info.GetReturnValue().Set(returnValue);
}

void Disconnect(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Isolate* isolate = info.GetIsolate();
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }
  // get string from arg
  v8::String::Utf8Value arg(isolate, info[0]->ToString(context).ToLocalChecked());
  std::string argValue(*arg);
  v8::Local<v8::String> returnValue = v8::String::NewFromUtf8(isolate, argValue.c_str()).ToLocalChecked();
  
  // NSArray *pairedDevices = [IOBluetoothDevice pairedDevices];
  // IOBluetoothDevice *device = [IOBluetoothDevice deviceWithAddressString:[NSString stringWithUTF8String:argValue.c_str()]];
  NSString *deviceAddress = [NSString stringWithUTF8String:argValue.c_str()];
  MyDisconnect(deviceAddress);
  
  // open connection first, else we can't disconnect
  // if ([device openConnection] != kIOReturnSuccess) {
  //   printf("Error disconnecting");
  // }
  // if ([device isConnected]) {
  //   printf("Device is connected\n");

  //   if ([device closeConnection] != kIOReturnSuccess) {
  //     printf("Error disconnecting");
  //   }
  // }
  info.GetReturnValue().Set(returnValue);
}

void Init(v8::Local<v8::Object> exports) {
  v8::Local<v8::Context> context =
      exports->GetCreationContext().ToLocalChecked();
      exports->Set(context,
                  Nan::New("getDevices").ToLocalChecked(),
                  Nan::New<v8::FunctionTemplate>(GetDevices)
                      ->GetFunction(context)
                      .ToLocalChecked());
      exports->Set(context,
                  Nan::New("getPaired").ToLocalChecked(),
                  Nan::New<v8::FunctionTemplate>(GetPaired)
                      ->GetFunction(context)
                      .ToLocalChecked());
      exports->Set(context,
                  Nan::New("connect").ToLocalChecked(),
                  Nan::New<v8::FunctionTemplate>(Connect)
                      ->GetFunction(context)
                      .ToLocalChecked());
      exports->Set(context,
                  Nan::New("disconnect").ToLocalChecked(),
                  Nan::New<v8::FunctionTemplate>(Disconnect)
                      ->GetFunction(context)
                      .ToLocalChecked());
}

NODE_MODULE(addon, Init)