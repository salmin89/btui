#include <napi.h>
#include "IOBluetooth.h"

Napi::Object ParseJson(const Napi::Env& env, const std::string& data) {
    Napi::Object json = env.Global().Get("JSON").As<Napi::Object>();
    Napi::Function parse = json.Get("parse").As<Napi::Function>();
    Napi::String jsonData = Napi::String::New(env, data);
    return parse.Call(json, { jsonData }).As<Napi::Object>();
}

Napi::Object CallGetAllPairedDevices(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  std::string data = GetAllPairedDevices();
  Napi::Object result = ParseJson(env, data);
  return result;
}

Napi::String CallConnect(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::String args = info[0].As<Napi::String>();
  std::string result = Connect(args.Utf8Value().c_str()); 
  return Napi::String::New(env, result);
}

Napi::String CallDisconnect(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::String args = info[0].As<Napi::String>();
  std::string result = Disconnect(args.Utf8Value().c_str()); 
  return Napi::String::New(env, result);
}

Napi::String CallAddToFavorites(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  Napi::String args = info[0].As<Napi::String>();
  std::string result = AddToFavorites(args.Utf8Value().c_str()); 
  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "getAllPairedDevices"), Napi::Function::New(env, CallGetAllPairedDevices));
  exports.Set(Napi::String::New(env, "connect"), Napi::Function::New(env, CallConnect));
  exports.Set(Napi::String::New(env, "disconnect"), Napi::Function::New(env, CallDisconnect));
  exports.Set(Napi::String::New(env, "addToFavorites"), Napi::Function::New(env, CallAddToFavorites));
  return exports;
}

NODE_API_MODULE(addon, Init)
