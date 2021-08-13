import { expect } from 'chai'
import agent from 'superagent-bluebird-promise'
require('dotenv').load()

const searchListing = (
  orderMethod, 
  locationMode,
  pageSize,
  location,
  headers
  ) => {
  return agent
  .get(`https://api-gtm.grubhub.com/restaurants/search/search_listing?orderMethod=${orderMethod}&locationMode=${locationMode}&facetSet=umamiV2&pageSize=${pageSize}&hideHateos=true&searchMetrics=true&location=${location}&preciseLocation=true&geohash=dr4e808shzcd&facet=promos%3Atrue&facet=open_now%3Atrue&sortSetId=umamiv3&countOmittingTimes=true'`)
  .set(headers)
  .then(res => res)
}


describe('tests', () => {
  let accessToken = null
  let headers = null
  it.only('shoud loaad proxies', done => {
    agent.get("https://raw.githubusercontent.com/scidam/proxy-list/master/proxy.json")
    .then(res => {
      console.log(res.body)
      done()
    })
  })
  it.only('should auth', done => {
    agent.post('https://api-gtm.grubhub.com/auth')
    .send({
      email: process.env.GRUBHUB_EMAIL, 
      password: process.env.GRUBHUB_PASSWORD,
      brand: 'GRUBHUB',
      client_id: process.env.CLIENT_ID,
      device_id: process.env.DEVICE_ID,

      })
      .then(res => {
        //console.log(res.body)
        const {credential, session_handle: {access_token, refresh_token}} = res.body
        accessToken = access_token
        expect(refresh_token).to.not.be.undefined
        expect(access_token).to.not.be.undefined
        expect(credential).to.not.be.undefined
        done()
      })

  })
  it.only('should search listings using access token', done => {
    headers = {
        'authority': 'api-gtm.grubhub.com',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        'dnt': '1',
        'perimeter-x': 'eyJ1IjoiMDU3MmUyOTAtZmMzYS0xMWViLThmMzgtMGZmMWQxZTYwMGEyIiwidiI6IjNjODQyNDgyLWY3ZjEtMTFlYi05NjBiLTAyNDJhYzEyMDAxYSIsInQiOjE2Mjg4NjE2NzAzMzcsImgiOiIxNWU1ZmJiMzNhNDQyMjc3ZDMxNzE3N2U4ODVlMmE2ZjRiOGUyMjMxZmEzNTc2N2U5MTZlYTkyMzU4YmVhZDNhIn0=',
        'sec-ch-ua-mobile': '?0',
        'authorization': `Bearer ${accessToken}`,
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
        'if-modified-since': '0',
        'origin': 'https://www.grubhub.com',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        'referer': 'https://www.grubhub.com/',
        'accept-language': 'en-US,en;q=0.9'
    };

    agent
    .get('https://api-gtm.grubhub.com/diners/783587cc-487f-11e4-9697-9cb654858910/search_listing?pageNum=1&pageSize=10&facet=scheduled%3Afalse&facet=orderType%3AALL&sorts=default')
    .set(headers)
    .then(res => {
      //console.log(res.body)
      const {stats} = res.body
      expect(stats).to.not.be.undefined
      done()
    })
    .catch(done)
  })

  it.only('should autocomplete addresses', done => {
    let queryText = '1200 market street'
    agent.get('https://api-gtm.grubhub.com/geocode/autocomplete?queryText=${queryText}&locationBias=true')
    .set(headers)
    .then(res => {
      //console.log(res.body)
      const { results } = res.body
      expect(results).to.be.an.array
      done()
    })
  })
  it.only('should autocomplete food', done => {
    const prefix = 'pizza'
    agent.get(`https://api-gtm.grubhub.com/autocomplete?prefix=${prefix}&lat=39.91175079&lng=-75.18917084&geohash=dr4e118yv3de&resultTypeList=dishTerm&resultTypeList=restaurant&locationMode=delivery&resultCount=8&isCatering=false`)
    .set(headers)
    .then(res => {
      //console.log(res.body)
      const {result_list} = res.body
      expect(result_list).to.be.an.array
      done()
    })
  })


})