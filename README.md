# Mapcident

## Problem Statement ⚠️

The [Global status report](https://www.who.int/publications-detail-redirect/9789241565684) on road safety by WHO, published in **2018**, highlights that the number of annual road traffic deaths has reached **1.35 million**. Road traffic injuries are now the leading killer of people aged between **5-29 years.**

A few major causes of these deaths and critical injuries are the **late medical response**, **bystanders’ negligence,** and **inability to contact** the right emergency services. The matter in concern is very critical and for the person involved in such accidents, every second is crucial for their health. 

A worse scenario could be that someone is present a few miles from where you have crashed and could help save your life, but isn’t aware of the accident.

Such preventable yet tragic scenarios are present in our day-to-day life and lead to the 1.35 million deaths we see each year and that’s what we seek to solve with **Mapcident** 

## Solution ✅
<img src="https://cdn.discordapp.com/attachments/872743735388172318/929514753926238288/https3A2F2Fs3-us-west-2.png">

**Mapcident** - An app that uses the phone’s **accelerometer** to detect accidents and crashes. On detection of any such incidents it follows the following procedure:

1. Reports the accident to the user’s listed emergency contacts via an **alert text message**
2. Makes an **emergency SOS call to ambulance** **services** through the user’s phone 
3. **Stores the important info** of the user (Name, Gender, Blood Group, Phone Number) for it to display to the rescuers
4. Adds your current location to the database, thus making a **networked map of all the accidents** being reported in real-time

**The problems Mapcident solves:**

- Cuts down on the crucial time lost trying to contact the emergency services when an accident takes place
- Instantly notifies your loved ones about the accident
- Displays important info of the person, making it efficient to ID the person for both bystanders as well as the emergency services
- Enables other app users in close proximity to locate and provide immediate aid

<table style="padding:10px">
  <tr>
    <td> 
        <img src="https://cdn.discordapp.com/attachments/872743735388172318/929339678165979147/unknown.png"  alt="1" width = 279px height = auto >
    </td>
    <td>
        <img src="https://cdn.discordapp.com/attachments/872743735388172318/929339711317741568/unknown.png" align="right" alt="2" width = 279px height = auto>
    </td>
    <td>
        <img src="https://cdn.discordapp.com/attachments/766636913343463454/929123782910681188/unknown.png" alt="3" width = 288px height = auto>
    </td>
  </tr>
</table>

This map would be used in our second feature which is that any person using the app could see **active accident sites** near them so that they can go over to the specific location to provide aid. Also, a notification overlay would be displayed on the devices of other users active in the proximity of a recently occurred accident.

## Hurdles We Overcame 🚧

Helping in such a situation is generally human nature, however, some people require an incentive to commit good deeds. That’s why we aim to provide **“Karmas 🧡”** as credits to the users if they go to a location and manage to help the injured person. These credits would be redeemable at stores/brands we plan to partner with in the future.

Knowing that this is a very sensitive issue, and false reporting could lead to a lot of stress among family members, we plan to alarm the user’s phone once a possible crash/accident is detected. Within a user-specified time (maximum of 2 minutes) of the alarm, the user can manually reject a false claim, and our app would note the data/readings in that case to prevent similar false claims in the future.

Another questionable yet possible act from the user end was the possibility of a user faking a helping act just to earn credits. This was a crucial hurdle for us since if not handled correctly it would’ve disrupted the functioning of the whole product. We tackled it by using Radar.io’s distance API that verifies the assistance is detected within 10 meters of the victim’s device.

Looking at this situation from a user experience perspective we have designed the user interface such that it’s easily navigable and accessible. Emphasis on big buttons and text is prominent throughout the app and usage of bright red color for the SOS pop-screens makes it easier for users to identify the screens and alerts.

## Tech Stack Used 👨🏻‍💻

1. Node.js
2. Express.js
3. MongoDB
4. EJS
5. MapMyIndia API
6. DeviceMotionEvent API
7. Geolocation API 
8. Socket.io
9. Radar.io

## Future Prospects 🔮

Since the problem we are picking up - Road Safety is a global problem, there would be demand all over the globe all over the year, not seasonal.

Our primary objective would be to tie up with government organizations or health agencies to get funding to develop the app further. Some functions we would like to implement down the line:

1. Self reporting by the user network and authenticating them (like Gmaps does with traffic jams)
2. Later we plan to expand and add the AI assistance feature that would give deeper insight into studying your past records of the user’s driving session. Ultimately our goal would be to use this data to reduce the risks on the road.
3. We’d be storing important information on crashes/accidents that would prove to be useful for the automotive industry safety standards.