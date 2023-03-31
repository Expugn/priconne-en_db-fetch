# priconne-en_db-fetch<br>Princess Connect Re:Dive (English Version) - Database Fetcher

## Princess Connect! Re:Dive English Server End-of-Service Announced
<https://twitter.com/priconne_en/status/1641606313150128128><br/>
As of March 30th 2023, Crunchyroll has announced they will be shutting down the English server of `Princess Connect! Re:Dive`. As a result, this repository will be archived.<br/>
**Do take the time to save/download any assets before the server goes offline on `April 30, 2023 (UTC)`.**

## Welcome!
This was made possible due to a collaborative effort with `jmrv#6264`.

I am making this a public repository as `esterTion`'s website hasn't included `priconne-en` in their API.<br>
*This is intended as a resource for anyone interested in datamining `Princess Connect Re:Dive`'s English server.*

## Information
`priconne-en_db-fetch` is a stripped down version of [pqh-updater](https://github.com/Expugn/pqh-updater), so it is written using JavaScript (Node.js) and Python.

This has been written while using `Windows 10`, directory paths may differ if using different operating systems.

Image datamining is not included as images can be found through other sources. ***THIS ONLY GETS THE MASTER DATABASE FILE.***

## Notes
The difference between `priconne-en` and `priconne-jp` so far is that the .unity3d file that holds the master database is **NOT** encrypted.<br>
**IT IS POSSIBLE THAT IN THE FUTURE THAT THIS WILL CHANGE. WHEN IT DOES, THIS CODE WILL BREAK.**

I can not guarantee that the TruthVersion guessing system will work flawlessly.<br>
**IF TruthVersions ARE INCREMENTED DIFFERENTLY THAN EXPECTED, THIS CODE WILL BREAK.**

If you are interested in image datamining, please review [pqh-updater](https://github.com/Expugn/pqh-updater).<br>
**`UnityPack` MAY NOT HAVE THE ABILITY TO DESERIALIZE THE IMAGES AS IT MIGHT NOT SUPPORT THE FORMAT IMAGES ARE SAVED IN.**

## Requirements
#### System
Node.js `v11.15.0` or above<br>
Python 3

#### python-tools/deserialize.py
- **lz4** `pip install lz4`
- **UnityPack** (provided) [GitHub](https://github.com/HearthSim/UnityPack)
