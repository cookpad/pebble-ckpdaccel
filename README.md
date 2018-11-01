# Cookpad Cooking Accelerometer

## Purpose

This is an experimental application that allows easy collecting of accelerometer
data thanks to a Pebble watch and a Ruby on Rails backend.

### Screenshots

![Pebble Main Screen](/docs/pebble_main_screen.png) ![Pebble Recording Screen](/docs/pebble_recording_screen.png)

![Pebble Settings](/docs/pebble_settings.jpg)

![Charts](/docs/charts.png)

## Setup

### Pebble

#### Phone setup and pairing

If you haven't yet, you need to setup your phone in order to use your Pebble
smart watch.

On your (preferably Android) phone:

1. You might want to start by running a factory reset on your watch:
   - From the watchface, press _Select_ (the middle button on the right).
   - Go to _Settings_ by navigating with the _Up_ and _Down_ buttons (the top and
   bottom ones on the right), and validating with _Select_.
   - Navigate to _System_ then _Factory Reset_, and finally confirm.
2. Download the [Pebble
application](https://play.google.com/store/apps/details?id=com.getpebble.android.basalt)
on the Google Play Store. Once downloaded, open and close it once in order to
initialize it.
3. Visit [auth.rebble.io](https://auth.rebble.io) and sign-in with the method you
want in order to create an account.
4. Once logged in, click on _get started now_, or visit
[boot.rebble.io](https://boot.rebble.io) in order to switch the Pebble
application to Rebble. After reading the explanations, click on _Switch to
Rebble_ at the bottom of the page.
5. Follow the application's setup wizard. When reaching the pairing step, make
sure the watch is ready for pairing as well. It may take a few attempts, but you
should be able to pair the watch to your phone.
6. Before next step, make sure your phone is connected to a WiFi network that
you can use from your computer as well.
7. Open the _Settings_ screen from the `...` menu. _Enable Developer Mode_ and
go to the _Developer Connection_ screen to enable it. Take note of the _Server
IP_ displayed.

#### SDK

Until [Rebble](http://rebble.io/) completely restores the Pebble store and
provides a way to publish Pebble applications, the only way to install this
application will be to side-load it using the Pebble SDK.

The documentation to install the Pebble SDK is still available thanks to
Rebble's work: [Installing the Pebble
SDK](https://developer.rebble.io/developer.pebble.com/sdk/install/index.html).

On Mac, the Homebrew package seems to sometimes have problems to install
properly depending on your setup, so you may need to fallback to the manual
installation. Before any attempt, make sure you're not overriding system
executables with more recent versions (such as Python or Ruby).

Once the installation following the steps described is complete, you still have
a couple steps to follow manually.

**Disable metrics collection**

Once the installation complete, the first time you run the `pebble` command, you
will be asked _Would you like to opt in to this collection?_ If you answer _no_,
the script will fail because it tries to send an opt-out analytics message to
Pebble's analytics servers (how ironic!) before saving your choice. If you
answer _yes_, the command will succeed, but the SDK will still be unable to
collect metrics, as Pebble discontinued their service.

To avoid issues, I recommend you manually create a `NO_TRACKING` file as
explained by the prompt you received. For example on MacOS:

```sh
touch "/Users/david-stosik/Library/Application Support/Pebble SDK/NO_TRACKING"
```

**Install the SDK core**

The `pebble` command is supposed to download and install the SDK core if it is
not already installed. Unfortunately, the servers are not available anymore.
Luckily, there is a way to point the installer to archived versions of the SDK:

```sh
pebble sdk install https://github.com/aveao/PebbleArchive/raw/master/SDKCores/sdk-core-4.3.tar.bz2
```

#### Build and install

Now you should be ready to build and install the Pebble application.

```sh
cd ckpdaccel/pebble
pebble build
pebble install --log --phone YOUR_PHONE_IP
```

## How to use

### Settings

The Pebble application ships with a settings screen on the phone, with clear
descriptions of what each setting does.

- Open the Pebble application on your phone.
- Go to the applications tab.
- Click on the _Cookpad Accelerometer_ app and on _Settings_.
- Change the settings as you want (you will at least need to set the API
endpoint after setting up your consumer server).
- _Save_.

### Watch application

- Use the watch's right-side buttons to navigate in the watch's menu and start
the _Cookpad Accelerometer_ application.
- Press the _Select_ button (next to the ▶️  icon) to start measuring and
streaming data.
- Press the _Select_ button again (now a ⏸ icon) to stop.

## Rails application

The provided Rails application is a very simple server that fullfils two
purposes:

- receive accelerometer data points from Pebble watches
- display simple charts of the data

### Setup

This is a very standard Ruby on Rails application. The use of a Ruby version
manager (for example [rbenv](https://github.com/rbenv/rbenv) or
[rvm](https://rvm.io/)) is recommended. You'll get best results with Ruby 2.5,
but other versions might work as well.

```sh
cd ckpdaccel/rails
gem install bundle
bundle install
bin/rails db:setup
bin/rails server --binding 0.0.0.0
```

The accelerometer datapoint POST endpoint is located at the site's root.
You'll need to set the watch app's API endpoint to
`http://YOUR_RAILS_SERVER_IP:3000`.

The site's front page also displays charts when accessed from a browser.

### API format

The watch sends the following JSON format to the API endpoint:

```json
{
  "watch_id": "left_wrist",
  "accels": [
    {
      "x": -443,
      "y": -466,
      "z": -822,
      "vibe": 0,
      "time": 3552487083
    },
    ...
  ]
}
```

The `accels` key will contain from 1 to 25 samples, as configured in the Pebble
watch application.
