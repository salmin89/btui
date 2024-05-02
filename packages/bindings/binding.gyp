{
  "targets": [
    {
      "target_name": "IOBluetooth-wrapper",
      "sources": [ "IOBluetooth-wrapper.mm"],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "link_settings": {
        "ldflags": ["-framework IOBluetooth", "-framework Foundation"],
        "libraries": ["/System/Library/Frameworks/Foundation.framework", "/System/Library/Frameworks/IOBluetooth.framework"]
      }
    }
  ]
}
