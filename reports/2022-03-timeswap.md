![Timeswap](/static/af7686ffc6a66293be7f63369a5a3581/4e333/timeswap.jpg)

Timeswap contest  
Findings & Analysis Report
=============================================

#### 2022-05-17

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (1)](#high-risk-findings-1)
    
    *   [\[H-01\] Wrong timing of check allows users to withdraw collateral without paying for the debt](#h-01-wrong-timing-of-check-allows-users-to-withdraw-collateral-without-paying-for-the-debt)
*   [Medium Risk Findings (3)](#medium-risk-findings-3)
    
    *   [\[M-01\] Underflown variable in `borrowGivenDebtETHCollateral` function](#m-01-underflown-variable-in-borrowgivendebtethcollateral-function)
    *   [\[M-02\] The `pay()` function can still be DOSed](#m-02-the-pay-function-can-still-be-dosed)
    *   [\[M-03\] NPM Dependency confusion. Unclaimed NPM Package and Scope/Org](#m-03-npm-dependency-confusion-unclaimed-npm-package-and-scopeorg)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [L-01 CollateralizedDebt.tokenURI fails when pair’s asset or collateral token have low decimals](#l-01-collateralizeddebttokenuri-fails-when-pairs-asset-or-collateral-token-have-low-decimals)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [Foreword](#foreword)
    *   [File: CollateralizedDebt.sol](#file-collateralizeddebtsol)
    *   [File: TimeswapPair.sol](#file-timeswappairsol)
    *   [General recommendation](#general-recommendation)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Timeswap smart contract system written in Solidity. The audit contest took place between March 4—March 6 2022.

[](#wardens)Wardens
-------------------

21 Wardens contributed reports to the Timeswap contest:

1.  IllIllI
2.  WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
3.  TerrierLover
4.  ch13fd357r0y3r
5.  hyh
6.  [Dravee](https://twitter.com/JustDravee)
7.  [gzeon](https://twitter.com/gzeon)
8.  0x1f8b
9.  robee
10.  [rfa](https://www.instagram.com/riyan_rfa/)
11.  kenta
12.  CertoraInc ([danb](https://twitter.com/danbinnun), egjlmn1, [OriDabush](https://twitter.com/ori_dabush), ItayG, and shakedwinder)
13.  cryptphi
14.  peritoflores
15.  [Tomio](https://twitter.com/meidhiwirara)
16.  [0v3rf10w](https://twitter.com/_0v3rf10w)

This contest was judged by [0xleastwood](https://twitter.com/liam_eastwood13).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 4 unique vulnerabilities. Of these vulnerabilities, 1 received a risk rating in the category of HIGH severity and 3 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 10 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 12 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

[](#scope)Scope
===============

The code under review can be found within the [C4 Timeswap contest repository](https://github.com/code-423n4/2022-03-timeswap), and is composed of 9 smart contracts written in the Solidity programming language and includes 1,654 lines of Solidity code.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low/non-critical.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code4rena.com).

[](#high-risk-findings-1)High Risk Findings (1)
===============================================

[](#h-01-wrong-timing-of-check-allows-users-to-withdraw-collateral-without-paying-for-the-debt)[\[H-01\] Wrong timing of check allows users to withdraw collateral without paying for the debt](https://github.com/code-423n4/2022-03-timeswap-findings/issues/16)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by IllIllI_

[TimeswapPair.sol#L459-L490](https://github.com/code-423n4/2022-03-timeswap/blob/00317d9a8319715a8e28361901ab14fe50d06172/Timeswap/Core/contracts/TimeswapPair.sol#L459-L490)  

    function pay(PayParam calldata param)
        external 
        override 
        lock 
        returns (
            uint128 assetIn, 
            uint128 collateralOut
        ) 
    {
        require(block.timestamp < param.maturity, 'E202');
        require(param.owner != address(0), 'E201');
        require(param.to != address(0), 'E201');
        require(param.to != address(this), 'E204');
        require(param.ids.length == param.assetsIn.length, 'E205');
        require(param.ids.length == param.collateralsOut.length, 'E205');
    
        Pool storage pool = pools[param.maturity];
    
        Due[] storage dues = pool.dues[param.owner];
        require(dues.length >= param.ids.length, 'E205');
    
        for (uint256 i; i < param.ids.length;) {
            Due storage due = dues[param.ids[i]];
            require(due.startBlock != BlockNumber.get(), 'E207');
            if (param.owner != msg.sender) require(param.collateralsOut[i] == 0, 'E213');
            require(uint256(assetIn) * due.collateral >= uint256(collateralOut) * due.debt, 'E303');
            due.debt -= param.assetsIn[i];
            due.collateral -= param.collateralsOut[i];
            assetIn += param.assetsIn[i];
            collateralOut += param.collateralsOut[i];
            unchecked { ++i; }
        }
        ...

At L484, if there is only one `id`, and for the first and only time of the for loop, `assetIn` and `collateralOut` will be `0`, therefore `require(uint256(assetIn) * due.collateral >= uint256(collateralOut) * due.debt, 'E303');` will pass.

A attacker can call `pay()` with `param.assetsIn[0] == 0` and `param.collateralsOut[i] == due.collateral`.

### [](#proof-of-concept)Proof of Concept

The attacker can:

1.  `borrow()` `10,000 USDC` with `1 BTC` as `collateral`;
2.  `pay()` with `0 USDC` as `assetsIn` and `1 BTC` as `collateralsOut`.

As a result, the attacker effectively stole `10,000 USDC`.

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Change to:

    for (uint256 i; i < param.ids.length;) {
        Due storage due = dues[param.ids[i]];
        require(due.startBlock != BlockNumber.get(), 'E207');
        if (param.owner != msg.sender) require(param.collateralsOut[i] == 0, 'E213');
        due.debt -= param.assetsIn[i];
        due.collateral -= param.collateralsOut[i];
        assetIn += param.assetsIn[i];
        collateralOut += param.collateralsOut[i];
        unchecked { ++i; }
    }
    
    require(uint256(assetIn) * due.collateral >= uint256(collateralOut) * due.debt, 'E303');
    ...

**[Mathepreneur (Timeswap) resolved and commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/16#issuecomment-1063973580):**

> [Timeswap-Labs/Timeswap-V1-Core@b23b44a](https://github.com/Timeswap-Labs/Timeswap-V1-Core/commit/b23b44a01d577a5bee77fb5f19d9f4ad1e8d13af)

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/16#issuecomment-1086569306):**

> This is an interesting find. It appears that `assetIn` and `collateralOut` are not checked properly during the first iteration of the for loop. As a result, this functionality of this function is inherently broken as the `require` statement will always be satisfied. Nice job!

* * *

[](#medium-risk-findings-3)Medium Risk Findings (3)
===================================================

[](#m-01-underflown-variable-in-borrowgivendebtethcollateral-function)[\[M-01\] Underflown variable in `borrowGivenDebtETHCollateral` function](https://github.com/code-423n4/2022-03-timeswap-findings/issues/32)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by TerrierLover_

`borrowGivenDebtETHCollateral` function does never properly call `ETH.transfer` due to underflow. If `borrowGivenDebtETHCollateral` function is not deprecated, it would cause unexpected behaviors for users.

### [](#proof-of-concept-1)Proof of Concept

Here are codes which contain a potential issue.

[Borrow.sol#L121-L127](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/libraries/Borrow.sol#L121-L127)  

    if (maxCollateral > dueOut.collateral) {
        uint256 excess;
        unchecked {
            excess -= dueOut.collateral;
        }
        ETH.transfer(payable(msg.sender), excess);
    }

`excess` variable is `uint256`, and `dueOut.collateral` variable is `uint112` as shown below. Hence, both variables will never be less than 0.

[IPair.sol#L22-L26](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Core/contracts/interfaces/IPair.sol#L22-L26)  

    struct Due {
        uint112 debt;
        uint112 collateral;
        uint32 startBlock;
    }

`uint256 excess` is initialized to 0. However, subtracting `dueOut.collateral` variable which is more than or equal to 0 from `excess` variable which is 0 will be less than 0. Hence, `excess -= dueOut.collateral` will be less than 0, and `excess` will be underflown.

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

The code should properly initialize `excess` variable.

`borrowGivenPercentETHCollateral` function uses `uint256 excess = maxCollateral` at similar functionality.  
[Borrow.sol#L347](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/libraries/Borrow.sol#L347)  

Hence, just initializing `excess` variable with `maxCollateral` can be a potential workaround to prevent the underflown.

    if (maxCollateral > dueOut.collateral) {
        uint256 excess = maxCollateral;
        unchecked {
            excess -= dueOut.collateral;
        }
        ETH.transfer(payable(msg.sender), excess);
    }

**[amateur-dev (Timeswap) confirmed](https://github.com/code-423n4/2022-03-timeswap-findings/issues/32)**

**[Mathepreneur (Timeswap) resolved and commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/32#issuecomment-1063313379):**

> [Timeswap-Labs/Timeswap-V1-Convenience@a6f0e74](https://github.com/Timeswap-Labs/Timeswap-V1-Convenience/commit/a6f0e744832bf7d9d65a043dde47c9dc593f6a3d)

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/32#issuecomment-1086574982):**

> Awesome find! I believe `medium` severity is the appropriate risk as this function will always revert when `maxCollateral > dueOut.collateral`.

* * *

[](#m-02-the-pay-function-can-still-be-dosed)[\[M-02\] The `pay()` function can still be DOSed](https://github.com/code-423n4/2022-03-timeswap-findings/issues/11)
------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by IllIllI_

From the prior contest:

> in the pay() function users repay their debt and in line 364:  
> [https://github.com/code-423n4/2022-01-timeswap/blob/main/Timeswap/Timeswap-V1-Core/contracts/TimeswapPair.sol#L364](https://github.com/code-423n4/2022-01-timeswap/blob/main/Timeswap/Timeswap-V1-Core/contracts/TimeswapPair.sol#L364)  
> it decreases their debt.
> 
> lets say a user wants to repay all his debt, he calls the pay() function with his full debt.  
> an attacker can see it and frontrun to repay a single token for his debt (since it’s likely the token uses 18 decimals, a single token is worth almost nothing)  
> and since your solidity version is above 0.8.0 the line:  
> due.debt -= assetsIn\[i\]; will revert due to underflow
> 
> The attacker can keep doing it everytime the user is going to pay and since 1 token is baisicly 0$ (18 decimals) the attacker doesn’t lose real money

[code-423n4/2022-01-timeswap-findings#86 (comment)](https://github.com/code-423n4/2022-01-timeswap-findings/issues/86#issue-1095233776)

The sponsor said this about the fix:

> The convenience contract will implement how much asset to pay in.

[code-423n4/2022-01-timeswap-findings#86 (comment)](https://github.com/code-423n4/2022-01-timeswap-findings/issues/86#issuecomment-1014760269)

The `pay()` function however is still DOSable. Having the `Convenience` contract contain a workaround means the `Convenience` contract is no longer a convenience but a requirement.

                due.debt -= param.assetsIn[i];

[TimeswapPair.sol#L485](https://github.com/code-423n4/2022-03-timeswap/blob/00317d9a8319715a8e28361901ab14fe50d06172/Timeswap/Core/contracts/TimeswapPair.sol#L485)

### [](#proof-of-concept-2)Proof of Concept

From the prior contest:

> A DoS on every user that repay his full debt (or enough that the difference between his total debt to what he pays his negligible)

[code-423n4/2022-01-timeswap-findings#86](https://github.com/code-423n4/2022-01-timeswap-findings/issues/86)

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Move the DOS protection to `TimeswapPair.pay()`

**[amateur-dev (Timeswap) confirmed](https://github.com/code-423n4/2022-03-timeswap-findings/issues/11)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/11#issuecomment-1086576722):**

> I believe this is a potential security risk and `medium` risk is appropriate. It is important to ensure protocol availability cannot be negatively impacted by nefarious actors.

* * *

[](#m-03-npm-dependency-confusion-unclaimed-npm-package-and-scopeorg)[\[M-03\] NPM Dependency confusion. Unclaimed NPM Package and Scope/Org](https://github.com/code-423n4/2022-03-timeswap-findings/issues/9)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by ch13fd357r0y3r_

I discovered an npm package and the scope of the package is unclaimed on the NPM website. This will give any User to claim that package and be able to Upload a Malicious Code under that unclaimed package. This results in achieving the Remote code execution on developers/users’ machine who depends on the timeswap repository to build it on local env.

Vulnerable Package Name: @timeswap-labs/timeswap-v1-core

### [](#proof-of-concept-3)Proof of Concept

1.  Create an Organization called “timeswap-labs”.
2.  Create a package called “@timeswap-labs/timeswap-v1-core” under “timeswap-labs” Organization.
3.  Attacker can able to upload malicious code on unclaimed npm package with a higher version like 99.99.99
4.  Now if any user/timeswap developer installs it by npm install package.json. The malicious pkg will be executed.

Till now “The Package is not claimed on NPM Registry, but it’s vulnerable to dependency confusion”. You can read more dependency confusion here: [https://dhiyaneshgeek.github.io/web/security/2021/09/04/dependency-confusion/](https://dhiyaneshgeek.github.io/web/security/2021/09/04/dependency-confusion/)

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Claim the Scope name called “timeswap-labs” by following the above POC Step 1.

**[amateur-dev (Timeswap) confirmed and commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/9#issuecomment-1063795498):**

> Created the organisation. Thank you.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/9#issuecomment-1087500908):**

> I think this is an interesting attack vector and useful find!
> 
> I would normally mark findings unrelated to Solidity code as `invalid`, however, I think the issue here raises an interesting exploit where an attacker could inject malicious code into a smart contract dependency. As such, I think this is relevant and a valid attack path.

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 10 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33) by **hyh** received the top score from the judge.

_The following wardens also submitted reports: [gzeon](https://github.com/code-423n4/2022-03-timeswap-findings/issues/25), [Dravee](https://github.com/code-423n4/2022-03-timeswap-findings/issues/36), [0x1f8b](https://github.com/code-423n4/2022-03-timeswap-findings/issues/7), [WatchPug](https://github.com/code-423n4/2022-03-timeswap-findings/issues/19), [cryptphi](https://github.com/code-423n4/2022-03-timeswap-findings/issues/5), [peritoflores](https://github.com/code-423n4/2022-03-timeswap-findings/issues/27), [robee](https://github.com/code-423n4/2022-03-timeswap-findings/issues/3), [rfa](https://github.com/code-423n4/2022-03-timeswap-findings/issues/30), and [kenta](https://github.com/code-423n4/2022-03-timeswap-findings/issues/38)._

[](#l-01-collateralizeddebttokenuri-fails-when-pairs-asset-or-collateral-token-have-low-decimals)\[L-01\] CollateralizedDebt.tokenURI fails when pair’s asset or collateral token have low decimals
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

[NFTTokenURIScaffold.sol#L166](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/libraries/NFTTokenURIScaffold.sol#L166)  

Standard ERC721 tokenURI call will fail for CollateralizedDebt pools whose underlying pair.asset() or pair.collateral() have decimals lower than 4 whenever the corresponding due quantity is lower than 1e9.

Pair’s asset and collateral ERC20 can be arbitrary and some ERC20 contracts have decimals lower than 4, so such a combination is possible. In such cases current tokenURI implementation fails, which can be the issue for all integrations down the line as various systems routinely make tokenURI calls.

Placing severity to be medium per ‘Assets not at direct risk, but the function of the protocol or its availability could be impacted’, which is the case here as protocol availability is in question when EIP level functionality fails.

### [](#references)References

[https://eips.ethereum.org/EIPS/eip-721](https://eips.ethereum.org/EIPS/eip-721)

[https://github.com/d-xo/weird-erc20#low-decimals](https://github.com/d-xo/weird-erc20#low-decimals)

### [](#proof-of-concept-4)Proof of Concept

NFTTokenURIScaffold.weiToPrecisionString will fail if used for a token with decimals lower than 4 as subtraction is performed without prior checks:

[NFTTokenURIScaffold.sol#L166](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/libraries/NFTTokenURIScaffold.sol#L166)  

NFTTokenURIScaffold.weiToPrecisionString is called by NFTTokenURIScaffold.tokenURI for pair’s asset and collateral ERC20:

[NFTTokenURIScaffold.sol#L16-L39](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/libraries/NFTTokenURIScaffold.sol#L16-L39)  

NFTTokenURIScaffold.tokenURI is used in CollateralizedDebt.tokenURI:

[CollateralizedDebt.sol#L46](https://github.com/code-423n4/2022-03-timeswap/blob/main/Timeswap/Convenience/contracts/CollateralizedDebt.sol#L46)  

Pair’s asset and collateral tokens can be arbitrary, while tokenURI is routinely requested by a variety of external systems

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Consider adding the check and special care for low decimals case, for example add another naming rule similarly to how `significantDigits > 1e9` case is being handled

**[amateur-dev (Timeswap) confirmed](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33)**

**[vhawk19 (Timeswap) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33#issuecomment-1066298800):**

> Have tested with zero decimals, yields in desired output as expected. ![Screenshot 2022-03-14 at 8 47 16 AM](https://user-images.githubusercontent.com/24829996/158098919-ff03f04e-821f-4b4d-b534-1d60f67ab32d.png)

**[Mathepreneur (Timeswap) resolved](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33)**

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33#issuecomment-1086577584):**

> Am I correct in understanding that `weiAmt` is denominated using 18 decimals and not the `decimal` value provided as an input to the `weiToPrecisionString()` function? I’m curious as to why this is not an issue.

**[amateur-dev (Timeswap) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33#issuecomment-1110648536):**

> Hi, we are aware of the issue highlighted. We have taken a conscious call for the decimals. We have done testing and confirm that our lend, borrow and similar transactions do not have an issue. The issue only arises once we call the URI of tokens with less than 4 decimals. In that sense, these tokens URI will not show up properly in opensea. The exposure is limited to that. We do not rely on that URI for any function call in our dapp.

**[0xleastwood (judge) commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/33#issuecomment-1112275217):**

> As per the sponsor’s comment, this issue only pertains to a token’s URI which is shown in opensea. The unlikely edge case raised by the warden should only occur when tokens with less than 4 decimals are used. Because of the limited exposure to an attack, I’m inclined to mark this as `1 (Low Risk)`.

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 12 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-03-timeswap-findings/issues/34) by **Dravee** received the top score from the judge.

_The following wardens also submitted reports: [IllIllI](https://github.com/code-423n4/2022-03-timeswap-findings/issues/13), [CertoraInc](https://github.com/code-423n4/2022-03-timeswap-findings/issues/14), [0x1f8b](https://github.com/code-423n4/2022-03-timeswap-findings/issues/6), [Tomio](https://github.com/code-423n4/2022-03-timeswap-findings/issues/18), [WatchPug](https://github.com/code-423n4/2022-03-timeswap-findings/issues/17), [gzeon](https://github.com/code-423n4/2022-03-timeswap-findings/issues/24), [TerrierLover](https://github.com/code-423n4/2022-03-timeswap-findings/issues/35), [robee](https://github.com/code-423n4/2022-03-timeswap-findings/issues/4), [rfa](https://github.com/code-423n4/2022-03-timeswap-findings/issues/31), [0v3rf10w](https://github.com/code-423n4/2022-03-timeswap-findings/issues/20), [kenta](https://github.com/code-423n4/2022-03-timeswap-findings/issues/37)._

[](#foreword)Foreword
---------------------

*   **Storage-reading optimizations**

> The code can be optimized by minimising the number of SLOADs. SLOADs are expensive (100 gas) compared to MLOADs/MSTOREs (3 gas). In the paragraphs below, please see the `@audit-issue` tags in the pieces of code’s comments for more information about SLOADs that could be saved by caching the mentioned **storage** variables in **memory** variables.

*   **`@audit` tags**

> The code is annotated at multiple places with `//@audit` comments to pinpoint the issues. Please, pay attention to them for more details.

[](#file-collateralizeddebtsol)File: CollateralizedDebt.sol
-----------------------------------------------------------

### [](#modifier-onlyconvenience)modifier onlyConvenience()

#### [](#inline-a-modifier-thats-only-used-once)Inline a modifier that’s only used once

As `onlyConvenience()` is only used once in this contract (in `function mint()`), it should get inlined to save gas:

    File: CollateralizedDebt.sol
    80:     modifier onlyConvenience() {
    81:         require(msg.sender == address(convenience), 'E403');
    82:         _;
    83:     }
    84: 
    85:     function mint(address to, uint256 id) external override onlyConvenience { //@audit onlyConvenience modifier only used only here: inline it.
    86:         _safeMint(to, id);
    87:     }

[](#file-timeswappairsol)File: TimeswapPair.sol
-----------------------------------------------

### [](#function-mint)function mint()

#### [](#use-memory-variables-for-calculation)Use memory variables for calculation

The code can be optimized from this:

    File: TimeswapPair.sol
    185:         pool.state.x += param.xIncrease;
    186:         pool.state.y += param.yIncrease;
    187:         pool.state.z += param.zIncrease;
    ...
    193:         emit Sync(param.maturity, pool.state.x, pool.state.y, pool.state.z); //@audit can save 3 SLOADs by using memory for calc

to this:

    File: TimeswapPair.sol
    185:         (uint112 _poolStateX, uint112 _poolStateY, uint112 _poolStateZ) = (pool.state.x + param.xIncrease, pool.state.y + param.yIncrease, pool.state.z + param.zIncrease);
    186: 
    187:         pool.state.x = _poolStateX;
    188:         pool.state.y = _poolStateY;
    189:         pool.state.z = _poolStateZ;
    ...
    195:         emit Sync(param.maturity, _poolStateX, _poolStateY, _poolStateZ);

### [](#function-burn)function burn()

#### [](#-0-is-less-efficient-than--0-for-unsigned-integers-with-proof)`> 0` is less efficient than `!= 0` for unsigned integers (with proof)

`!= 0` costs less gas compared to `> 0` for unsigned integers in `require` statements with the optimizer enabled (6 gas)

Proof: While it may seem that `> 0` is cheaper than `!=`, this is only true without the optimizer enabled and outside a require statement. If you enable the optimizer at 10k AND you’re in a `require` statement, this will save gas. You can see this tweet for more proofs: [https://twitter.com/gzeon/status/1485428085885640706](https://twitter.com/gzeon/status/1485428085885640706)

I suggest changing `> 0` with `!= 0` here:

    File: TimeswapPair.sol
    225:         require(pool.state.totalLiquidity > 0, 'E206'); //@audit should be != 0

Also, please enable the Optimizer.

### [](#function-lend)function lend()

#### [](#use-memory-variables-for-calculation-1)Use memory variables for calculation

Just like in `function mint()` ( [Use memory variables for calculation](#use-memory-variables-for-calculation) ), the code can be optimized here by caching the new values for `pool.state.x`, `pool.state.y` and `pool.state.z` :

    File: TimeswapPair.sol
    310:         pool.state.x += param.xIncrease;
    311:         pool.state.y -= param.yDecrease;
    312:         pool.state.z -= param.zDecrease;
    ...
    320:         emit Sync(param.maturity, pool.state.x, pool.state.y, pool.state.z);//@audit can save 3 SLOADs by using memory for calc

The same way, the final code will look like this (with the difference that `yDecrease` and `zDecreased` are used here):

             (uint112 _poolStateX, uint112 _poolStateY, uint112 _poolStateZ) = (pool.state.x + param.xIncrease, pool.state.y - param.yDecrease, pool.state.z - param.zDecrease);
     
             pool.state.x = _poolStateX;
             pool.state.y = _poolStateY;
             pool.state.z = _poolStateZ;
    ...
             emit Sync(param.maturity, _poolStateX, _poolStateY, _poolStateZ);

### [](#function-borrow)function borrow()

#### [](#use-memory-variables-for-calculation-2)Use memory variables for calculation

Just like in `function mint()` ( [Use memory variables for calculation](#use-memory-variables-for-calculation) ) and `function lend()`, the code can be optimized here by caching the new values for `pool.state.x`, `pool.state.y` and `pool.state.z` :

    File: TimeswapPair.sol
    432:         pool.state.x -= param.xDecrease;
    433:         pool.state.y += param.yIncrease;
    434:         pool.state.z += param.zIncrease;
    ...
    444:         emit Sync(param.maturity, pool.state.x, pool.state.y, pool.state.z);//@audit can save 3 SLOADs by using memory for calc

The same way, the final code will look like this (with the difference that `xDecrease` is used here):

             (uint112 _poolStateX, uint112 _poolStateY, uint112 _poolStateZ) = (pool.state.x - param.xDecrease, pool.state.y + param.yIncrease, pool.state.z + param.zIncrease);
     
             pool.state.x = _poolStateX;
             pool.state.y = _poolStateY;
             pool.state.z = _poolStateZ;
    ...
             emit Sync(param.maturity, _poolStateX, _poolStateY, _poolStateZ);

### [](#function-pay)function pay()

#### [](#an-arrays-length-should-be-cached-to-save-gas-in-for-loops)An array’s length should be cached to save gas in for-loops

Reading array length at each iteration of the loop takes 6 gas (3 for mload and 3 to place memory\_offset) in the stack.

Caching the array length in the stack saves around 3 gas per iteration.

Here, I suggest storing the array’s length in a variable before the for-loop, and use it instead:

    File: TimeswapPair.sol
    480:         for (uint256 i; i < param.ids.length;) { //@audit cache this

[](#general-recommendation)General recommendation
-------------------------------------------------

### [](#use-custom-errors-instead-of-revert-strings-to-save-gas)Use Custom Errors instead of Revert Strings to save Gas

Custom errors from Solidity 0.8.4 are cheaper than revert strings (cheaper deployment cost and runtime cost when the revert condition is met)

Source: [https://blog.soliditylang.org/2021/04/21/custom-errors/](https://blog.soliditylang.org/2021/04/21/custom-errors/):

> Starting from [Solidity v0.8.4](https://github.com/ethereum/solidity/releases/tag/v0.8.4), there is a convenient and gas-efficient way to explain to users why an operation failed through the use of custom errors. Until now, you could already use strings to give more information about failures (e.g., `revert("Insufficient funds.");`), but they are rather expensive, especially when it comes to deploy cost, and it is difficult to use dynamic information in them.

Custom errors are defined using the `error` statement, which can be used inside and outside of contracts (including interfaces and libraries).

See [original submission](https://github.com/code-423n4/2022-03-timeswap-findings/issues/34) for a list of instances.

I suggest replacing revert strings with custom errors.

**[amateur-dev (Timeswap) confirmed](https://github.com/code-423n4/2022-03-timeswap-findings/issues/34)**

**[Mathepreneur (Timeswap) resolved and commented](https://github.com/code-423n4/2022-03-timeswap-findings/issues/34#issuecomment-1063310140):**

> [Timeswap-Labs/Timeswap-V1-Convenience@7434c3d](https://github.com/Timeswap-Labs/Timeswap-V1-Convenience/commit/7434c3db21ce9f2cb70baa6c21ff8c7d7e53441a)  
> [Timeswap-Labs/Timeswap-V1-Core@7055734](https://github.com/Timeswap-Labs/Timeswap-V1-Core/commit/7055734945c51fc28504889bb7afeb080e25af14)  
> 
> Some implementation can’t be implemented due to stack too deep error.

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }