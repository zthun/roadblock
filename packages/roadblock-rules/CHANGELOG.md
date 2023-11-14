# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0](https://github.com/zthun/works/compare/v3.1.2...v4.0.0) (2022-05-26)


### ⚠ BREAKING CHANGES

* updated nestjs version requirement to 8.4

### Features

* updated nestjs version requirement to 8.4 ([ee6df1b](https://github.com/zthun/works/commit/ee6df1b46f053d8e91292281cc195a05564730e3))



## [3.1.0](https://github.com/zthun/works/compare/v3.0.10...v3.1.0) (2022-01-30)


### Features

* updating to latest helmet ([5f41414](https://github.com/zthun/works/commit/5f41414c096fecc7baf287cf1e26bab22996b320))



### [3.0.7](https://github.com/zthun/works/compare/v3.0.6...v3.0.7) (2022-01-16)

**Note:** Version bump only for package @zthun/works.nest





### [3.0.6](https://github.com/zthun/works/compare/v3.0.2...v3.0.6) (2022-01-16)

**Note:** Version bump only for package @zthun/works.nest





### [3.0.5](https://github.com/zthun/works/compare/v3.0.2...v3.0.5) (2022-01-15)

**Note:** Version bump only for package @zthun/works.nest





### [3.0.4](https://github.com/zthun/works/compare/v3.0.2...v3.0.4) (2022-01-15)

**Note:** Version bump only for package @zthun/works.nest





### [3.0.3](https://github.com/zthun/works/compare/v3.0.2...v3.0.3) (2022-01-15)

**Note:** Version bump only for package @zthun/works.nest





### [3.0.2](https://github.com/zthun/works/compare/v3.0.1...v3.0.2) (2022-01-14)


### Bug Fixes

* identity should return no content, not created for no user ([aec1d77](https://github.com/zthun/works/commit/aec1d7775b0704033a0b3c0979a08766350e4484))



## [3.0.0](https://github.com/zthun/works/compare/v2.4.1...v3.0.0) (2021-12-22)


### ⚠ BREAKING CHANGES

* renamed apps module to applications module
* removed images no longer relevant to works.nest
* removed the auth module from works.nest.  This has transitioned over to roadblock

### Features

* removed images no longer relevant to works.nest ([6ee2df8](https://github.com/zthun/works/commit/6ee2df80469f48a2fbbab8e7930249f4a169b16b))
* removed the auth module from works.nest.  This has transitioned over to roadblock ([06ce096](https://github.com/zthun/works/commit/06ce096e4bd014a3793c97fa5f7457b075ca0535))


### Code Refactoring

* renamed apps module to applications module ([3ed9a04](https://github.com/zthun/works/commit/3ed9a04de4ea2aa2723b0bee6931667fb7d37fb5))



### [2.4.1](https://github.com/zthun/works/compare/v2.4.0...v2.4.1) (2021-12-21)


### Bug Fixes

* don't import from a bucket ([8e8665c](https://github.com/zthun/works/commit/8e8665c7bb7ee2cb4a1631e781fc2172234cfc38))



## [2.4.0](https://github.com/zthun/works/compare/v2.3.0...v2.4.0) (2021-12-21)


### Features

* added a root application module that standardizes routes and cross cutting features ([b1979cf](https://github.com/zthun/works/commit/b1979cf30400eee2a06c6a8621c2a4b902619ec0))
* added the security controller ([ff83859](https://github.com/zthun/works/commit/ff83859f9e1daab4efebfd2ca3a81f695c1e9b4c))


### Bug Fixes

* removing the options module ([2618edb](https://github.com/zthun/works/commit/2618edbf13c014c8de4e15f906337ffd70090839))



## [2.3.0](https://github.com/zthun/works/compare/v2.2.1...v2.3.0) (2021-12-20)


### Features

* added the security module for cross cutting cookie reads ([4b51273](https://github.com/zthun/works/commit/4b512731c1d0117b0493d5071e3404f05e71d8e9))
* combined the configs into one system configuration ([16b9280](https://github.com/zthun/works/commit/16b928042a664448ca935e77cb3971b2ce77f1b4))
* moved cookie rules to the security module ([5433621](https://github.com/zthun/works/commit/54336214318a8fde31089b1f3c8ccab56e1e945a))



### [2.2.1](https://github.com/zthun/works/compare/v2.2.0...v2.2.1) (2021-12-20)


### Bug Fixes

* export the additional cookie rules ([2829474](https://github.com/zthun/works/commit/28294746ff7b7118f4d1cffb49b06ef1349bc80c))



## [2.2.0](https://github.com/zthun/works/compare/v2.1.0...v2.2.0) (2021-12-20)


### Features

* the nest package no longer depends on jsonwebtoken ([2ab34ab](https://github.com/zthun/works/commit/2ab34ab34db881dc3c9cd91b4f45417f35805ce2))



## [2.1.0](https://github.com/zthun/works/compare/v2.0.0...v2.1.0) (2021-12-19)


### Features

* moved the configurations to a new config module ([8656036](https://github.com/zthun/works/commit/8656036f42db5fd666a19504779876cb5d8a4bc9))
* no longer depends on nodemailer ([7ac6e17](https://github.com/zthun/works/commit/7ac6e172d4ae0d46188973990de7f94475f96135))
* update to use the new notifications microservice ([7625e52](https://github.com/zthun/works/commit/7625e5233e8720996703e98175e3b15aef58b76a))
* works.nest no longer depends on works.dal ([3b53905](https://github.com/zthun/works/commit/3b53905bd5c93c5627f0706d4f4b5ae89cdd8c09))


### Bug Fixes

* updated packages with bug fixes ([dc49918](https://github.com/zthun/works/commit/dc499187c0a25d1a35f5c53ca1290c1bae40e135))



## [2.0.0](https://github.com/zthun/works/compare/v1.4.0...v2.0.0) (2021-11-15)


### ⚠ BREAKING CHANGES

* updating to latest packages

### Features

* added the http module ([62e6f95](https://github.com/zthun/works/commit/62e6f957034e4743060324d1737300e1fef8084a))


### Miscellaneous Chores

* updating to latest packages ([d1fe1ba](https://github.com/zthun/works/commit/d1fe1baf3bd92aa56f46b7d05f1a2d4e330e5e03))



## [1.2.0](https://github.com/zthun/works/compare/v1.1.0...v1.2.0) (2021-09-01)


### Features

* added the apps module and controller ([b3a3a2b](https://github.com/zthun/works/commit/b3a3a2b9142802530b28dc4ce5a32ed29a0e4298))
* nest now has a peer dependency on works.url ([3697ee5](https://github.com/zthun/works/commit/3697ee5034924e3f2fdb7ab70c3c49b8b3bdb3c1))
* the app service now returns the icons for the necessary apps ([6f04a90](https://github.com/zthun/works/commit/6f04a907a9d2da4d68896888b970a514894353c6))



## [1.1.0](https://github.com/zthun/works/compare/v1.0.0...v1.1.0) (2021-08-15)


### Features

* added the options module and controller ([06e78d1](https://github.com/zthun/works/commit/06e78d16c44590f7a3b453721bfe288b807d2405))



## [1.0.0-29](https://github.com/zthun/works/compare/v1.0.0-28...v1.0.0-29) (2021-08-09)

**Note:** Version bump only for package @zthun/works.nest





## [1.0.0-28](https://github.com/zthun/works/compare/v1.0.0-27...v1.0.0-28) (2021-08-07)


### ⚠ BREAKING CHANGES

* updated nestjs
* you can no longer list users from the users service

### Features

* updated nestjs ([98d2248](https://github.com/zthun/works/commit/98d224887a87c2f89fdb2f84cfda3dedc64a69b8))
* you can no longer list users from the users service ([0daa679](https://github.com/zthun/works/commit/0daa67935bc34f167d813486670fb2b572b100c9))


### Bug Fixes

* an unavailable email server will now throw a proper error ([fe34073](https://github.com/zthun/works/commit/fe34073972b89fccc6362305e563a3a0c9f2c3ef))



## [1.0.0-27](https://github.com/zthun/works/compare/v1.0.0-26...v1.0.0-27) (2021-06-18)

**Note:** Version bump only for package @zthun/works.nest





# [1.0.0-26](https://github.com/zthun/works/compare/v1.0.0-25...v1.0.0-26) (2021-05-27)

**Note:** Version bump only for package @zthun/works.nest





# [1.0.0-25](https://github.com/zthun/works/compare/v1.0.0-24...v1.0.0-25) (2021-03-27)

**Note:** Version bump only for package @zthun/works.nest
