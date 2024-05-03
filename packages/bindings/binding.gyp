{
  'targets': [
    {
      'target_name': 'addon',
      "sources": ["src/addon.cc", "src/IOBluetooth.m"],
      'include_dirs': ["<!@(node -p \"require('node-addon-api').include\")"],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'link_settings': {
        'ldflags': ['-framework IOBluetooth', '-framework Foundation'],
        "libraries": ["/System/Library/Frameworks/IOBluetooth.framework", "/System/Library/Frameworks/Foundation.framework"]
      },
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
    }
  ]
}