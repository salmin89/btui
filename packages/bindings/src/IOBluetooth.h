#ifndef MYOBJC_H
#define MYOBJC_H

#ifdef __cplusplus
extern "C" {
#endif

// Objective-C function declaration
const char* GetAllPairedDevices();
const char* Connect(const char* deviceId);
const char* Disconnect(const char* deviceId);
const char* AddToFavorites(const char* deviceId);

#ifdef __cplusplus
}
#endif

#endif  // MYOBJC_H
