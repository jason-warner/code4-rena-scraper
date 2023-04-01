![Perennial](/static/588c8a174f952b481d3b5fd7c589641a/4e333/perennial.jpg)

Perennial contest  
Findings & Analysis Report
==============================================

#### 2022-01-24

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (2)](#high-risk-findings-2)
    
    *   [\[H-01\] Wrong shortfall calculation](#h-01-wrong-shortfall-calculation)
    *   [\[H-02\] `withdrawTo` Does Not Sync Before Checking A Position’s Margin Requirements](#h-02-withdrawto-does-not-sync-before-checking-a-positions-margin-requirements)
*   [Medium Risk Findings (3)](#medium-risk-findings-3)
    
    *   [\[M-01\] No checks if given product is created by the factory](#m-01-no-checks-if-given-product-is-created-by-the-factory)
    *   [\[M-02\] Multiple initialization of Collateral contract](#m-02-multiple-initialization-of-collateral-contract)
    *   [\[M-03\] Chainlink’s `latestRoundData` might return stale or incorrect results](#m-03-chainlinks-latestrounddata-might-return-stale-or-incorrect-results)
*   [Low Risk Findings (6)](#low-risk-findings-6)
*   [Non-Critical Findings (5)](#non-critical-findings-5)
*   [Gas Optimizations (22)](#gas-optimizations-22)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 code contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the code contest outlined in this document, C4 conducted an analysis of Perennial contest smart contract system written in Solidity. The code contest took place between December 9—December 15 2021.

[](#wardens)Wardens
-------------------

13 Wardens contributed reports to the Perennial contest:

1.  [leastwood](https://twitter.com/liam_eastwood13)
2.  [kenzo](https://twitter.com/KenzoAgada)
3.  WatchPug ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
4.  0x0x0x
5.  0x1f8b
6.  [cmichel](https://twitter.com/cmichelio)
7.  robee
8.  hubble (ksk2345 and shri4net)
9.  [defsec](https://twitter.com/defsec_)
10.  [ye0lde](https://twitter.com/_ye0lde)
11.  [gzeon](https://twitter.com/gzeon)
12.  [pmerkleplant](https://twitter.com/merkleplant_eth)
13.  [broccolirob](https://twitter.com/0xbroccolirob)

This contest was judged by [Alex the Entreprenerd](https://twitter.com/GalloDaSballo).

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay) and [CloudEllie](https://twitter.com/CloudEllie1).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 11 unique vulnerabilities and 38 total findings. All of the issues presented here are linked back to their original finding.

Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity, 3 received a risk rating in the category of MEDIUM severity, and 6 received a risk rating in the category of LOW severity.

C4 analysis also identified 5 non-critical recommendations and 22 gas optimizations.

[](#scope)Scope
===============

The code under review can be found within the [C4 Perennial contest repository](https://github.com/code-423n4/2021-12-perennial), and is composed of 38 smart contracts written in the Solidity programming language and includes 3531 lines of Solidity code and 7 lines of JavaScript.

[](#severity-criteria)Severity Criteria
=======================================

C4 assesses the severity of disclosed vulnerabilities according to a methodology based on [OWASP standards](https://owasp.org/www-community/OWASP_Risk_Rating_Methodology).

Vulnerabilities are divided into three primary risk categories: high, medium, and low.

High-level considerations for vulnerabilities span the following key areas when conducting assessments:

*   Malicious Input Handling
*   Escalation of privileges
*   Arithmetic
*   Gas use

Further information regarding the severity criteria referenced throughout the submission review process, please refer to the documentation provided on [the C4 website](https://code423n4.com).

[](#high-risk-findings-2)High Risk Findings (2)
===============================================

[](#h-01-wrong-shortfall-calculation)[\[H-01\] Wrong shortfall calculation](https://github.com/code-423n4/2021-12-perennial-findings/issues/18)
-----------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by kenzo_

Every time an account is settled, if shortfall is created, due to a wrong calculation shortfall will double in size and add the new shortfall.

#### [](#impact)Impact

Loss of funds: users won’t be able to withdraw the correct amount of funds. Somebody would have to donate funds to resolve the wrong shortfall.

#### [](#proof-of-concept)Proof of Concept

We can see in the `settleAccount` of `OptimisticLedger` that `self.shortfall` ends up being `self.shortfall+self.shortfall+newShortfall`: [(Code ref)](https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/collateral/types/OptimisticLedger.sol#L63:#L74)

    function settleAccount(OptimisticLedger storage self, address account, Fixed18 amount)
    internal returns (UFixed18 shortfall) {
        Fixed18 newBalance = Fixed18Lib.from(self.balances[account]).add(amount);
    
        if (newBalance.sign() == -1) {
            shortfall = self.shortfall.add(newBalance.abs());
            newBalance = Fixed18Lib.ZERO;
        }
    
        self.balances[account] = newBalance.abs();
        self.shortfall = self.shortfall.add(shortfall);
    }

Additionally, you can add the following line to the “shortfall reverts if depleted” test in `Collateral.test.js`, line 190:

    await collateral.connect(productSigner).settleAccount(userB.address, -50)

Previously the test product had 50 shortfall. Now we added 50 more, but the test will print that the actual shortfall is 150, and not 100 as it should be.

#### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Move the setting of `self.shortfall` to inside the if function and change the line to:

        self.shortfall = shortfall

**[kbrizzle (Perennial) confirmed](https://github.com/code-423n4/2021-12-perennial-findings/issues/18#issuecomment-995416504):**

> Excellent find 🙏

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/18#issuecomment-1001280292):**

> Agree with the finding `shortfall = self.shortfall.add(newBalance.abs());` is already shortfal + newBalance.abs() So performing line `73` `self.shortfall = self.shortfall.add(shortfall);` is adding `shortfall` again

[](#h-02-withdrawto-does-not-sync-before-checking-a-positions-margin-requirements)[\[H-02\] `withdrawTo` Does Not Sync Before Checking A Position’s Margin Requirements](https://github.com/code-423n4/2021-12-perennial-findings/issues/74)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by leastwood_

#### [](#impact-1)Impact

The `maintenanceInvariant` modifier in `Collateral` aims to check if a user meets the margin requirements to withdraw collateral by checking its current and next maintenance. `maintenanceInvariant` inevitably calls `AccountPosition.maintenance` which uses the oracle’s price to calculate the margin requirements for a given position. Hence, if the oracle has not synced in a long time, `maintenanceInvariant` may end up utilising an outdated price for a withdrawal. This may allow a user to withdraw collateral on an undercollaterized position.

#### [](#proof-of-concept-1)Proof of Concept

[https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/collateral/Collateral.sol#L67-L76](https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/collateral/Collateral.sol#L67-L76)

    function withdrawTo(address account, IProduct product, UFixed18 amount)
    notPaused
    collateralInvariant(msg.sender, product)
    maintenanceInvariant(msg.sender, product)
    external {
        _products[product].debitAccount(msg.sender, amount);
        token.push(account, amount);
    
        emit Withdrawal(msg.sender, product, amount);
    }

[https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/collateral/Collateral.sol#L233-L241](https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/collateral/Collateral.sol#L233-L241)

    modifier maintenanceInvariant(address account, IProduct product) {
        _;
    
        UFixed18 maintenance = product.maintenance(account);
        UFixed18 maintenanceNext = product.maintenanceNext(account);
    
        if (UFixed18Lib.max(maintenance, maintenanceNext).gt(collateral(account, product)))
            revert CollateralInsufficientCollateralError();
    }

[https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/product/types/position/AccountPosition.sol#L71-L75](https://github.com/code-423n4/2021-12-perennial/blob/main/protocol/contracts/product/types/position/AccountPosition.sol#L71-L75)

    function maintenanceInternal(Position memory position, IProductProvider provider) private view returns (UFixed18) {
        Fixed18 oraclePrice = provider.priceAtVersion(provider.currentVersion());
        UFixed18 notionalMax = Fixed18Lib.from(position.max()).mul(oraclePrice).abs();
        return notionalMax.mul(provider.maintenance());
    }

#### [](#tools-used)Tools Used

Manual code review.

#### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Consider adding `settleForAccount(msg.sender)` to the `Collateral.withdrawTo` function to ensure the most up to date oracle price is used when assessing an account’s margin requirements.

**[kbrizzle (Perennial) confirmed](https://github.com/code-423n4/2021-12-perennial-findings/issues/74#issuecomment-996589429):**

> Great catch 🙏

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/74#issuecomment-1001590562):**

> With most onChain protocols where there is potential for undercollateralized positions and liquidations, it is very important to accrue a user position before making any changes to their balance.
> 
> The warden identified a potential way for a user to withdraw funds while their account is below margin requirements.
> 
> Because this impacts the core functionality functionality of the protocol (accounting), I’m raising the severity to high
> 
> Mitigation seems to be straightforward

[](#medium-risk-findings-3)Medium Risk Findings (3)
===================================================

[](#m-01-no-checks-if-given-product-is-created-by-the-factory)[\[M-01\] No checks if given product is created by the factory](https://github.com/code-423n4/2021-12-perennial-findings/issues/63)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0x0x0x_

An attacker can create a fake product. `Collateral` contract does not check whether the given product is created by the factory. A malicious product can return arbitrary maintenance amounts, therefore they can make any deposit to fake product stuck (simply return collateral - 1 as maintenance) and fake product owner can change the maintenance and liquidate whenever wanted and claim full collateral.

This is a serious attack vector, since by only interacting with `Collateral` contract the user can lose funds. Furthermore, this vulnerability poses big risks in combination web vulnerabilities. Users always have to check the product address to avoid getting scammed, but likely most users will only check the contract address.

Furthermore, if another protocol would want to add perennial protocol for its use case, the other protocol has to be careful with this behaviour and keep track of whitelisted products. This complicates adoption of perennial protocol, since whitelist has to be managed manually or else this vulnerability will likely be exploitable.

#### [](#mitigation-step)Mitigation step

Add a mapping inside `Collateral`, which verifies whether a product is created by factory or not. This mapping should get updated by the factory. This will add a little bit gas cost, but will eliminate a serious attack vector.

Or less gas efficient option is directly call a function from factory to verify.

**[kbrizzle (Perennial) disagreed with severity](https://github.com/code-423n4/2021-12-perennial-findings/issues/63#issuecomment-997158601):**

> Good find 🙏
> 
> On severity: In general there’s a whole plethora of ways a Product owner could create a product that harmful a user which choses to take part in it. The design model of Perennial is to give the Product owners the _freedom_ to create risky products, but to segregate that risk to only those products, and this issue does not break this segregation of risk. This is especially important during our gated-beta phase while we learn which levers are worth it to lock down.
> 
> That being said this is low hanging fruit to correct, so we think it should still be `2 (Medium)` severity.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/63#issuecomment-1001284165):**

> Given the extensible nature of the `Collateral` contract, users can call the contract with any user input for `product` this could be used maliciously against the users as the warden highlighted.
> 
> This can definitely happen, but is contingent on a set of external factors, so I think medium severity is more appropriate

[](#m-02-multiple-initialization-of-collateral-contract)[\[M-02\] Multiple initialization of Collateral contract](https://github.com/code-423n4/2021-12-perennial-findings/issues/13)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by 0x1f8b_

#### [](#impact-2)Impact

The attacker can initialize the contract, take malicious actions, and allow it to be re-initialized by the project without any error being noticed.

#### [](#proof-of-concept-2)Proof of Concept

The `initialize` method of the`Collateral` contract does not contain the `initializer` modifier, it delegates this process to check if the factory is different from address(0) in the`UFactoryProvider__initialize` call, however the `factory_`is other than address(0), so an attacker could use front-running by listening to the memory pool, initialize the contract with a `factory=address(0)`, perform malicious actions, and still allow it to be started later by the I draft the contract without noticing any error.

Source reference:

*   Collateral.initialize

#### [](#tools-used-1)Tools Used

Manual review

#### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Use `initializer` modifier

**[kbrizzle (Perennial) marked as duplicate](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-995339471):**

> Duplicate of: [https://github.com/code-423n4/2021-12-perennial-findings/issues/71](https://github.com/code-423n4/2021-12-perennial-findings/issues/71)

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001284802):**

> Disagree with sponsor that this is duplicate of #73

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001285612):**

> The finding mentions that `initialize` can be called multiple times, specifically by first having `factory` set to address(0) and then setting it to it’s final value.
> 
> This is true.
> 
> Calling initialize multiple times could allow to set certain values up with a different token, then change to another token and set the factory. This could be used to trick the protocol accounting to later take advantage of other depositors.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001285964):**

> The specific vulnerability is the lack of the `initializer` modifier on initialize, the consequences can be problematic only if a malicious actor were to set the contracts up.
> 
> Because this can be done, and it’s reliant on a specific setup, I’ll mark the finding as medium severity, mitigation is straightforward

**[kbrizzle (Perennial) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001294139):**

> My understanding of these is that:
> 
> *   [](#73-would-allow-an-attacker-to-front-run-the-initialization-of-a-contract-to-gain-admin-but-the-subsequent-legitimate-attempt-to-initialize-would-revert)73 would allow an attacker to front-run the initialization of a contract to gain admin, but the subsequent legitimate attempt to initialize would revert.
>     =====================================================================================================================================================================================================================================================================================================================
>     
> *   [](#13-would-allow-an-attacker-to-front-run-the-initialization-of-a-contract-to-gain-admin-and-the-subsequent-legitimate-attempt-to-initialize-would-still-work-thereby-possibly-going-unnoticed)13 would allow an attacker to front-run the initialization of a contract to gain admin, and the subsequent legitimate attempt to initialize would still work (thereby possibly going unnoticed).
>     =================================================================================================================================================================================================================================================================================================================================================================================================
>     
> 
> If we want to tag these as separate issues, I think that makes sense as the effects are slightly different. Both are ultimately a documentation issue though solved by this [remediation](https://github.com/code-423n4/2021-12-perennial-findings/issues/71#issuecomment-995343823), so I’m wondering why one is tagged as `0 (Non-critical)` and the other `2 (Medium)`.
> 
> Is that correct, or is there an issue here even _with_ proper atomic deploy-and-initialize usage with OZ’s upgrades plugin? Just want to make sure we’re not missing something else here. Also - we do not have an `initializer` modifier available in the code base, so the remediation suggestion was a little confusing.

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001296121):**

> @kbrizzle Yes, this is something that can still be done, arguably only by your deployer
> 
> You could deploy and `initialize` the contract with factory set to 0, use that to perform operations with a token you created (so it has no cost to you), then `initialize` again with factory set to the proper value
> 
> Because certain functions do not check for the product being created by the factory, this can be done as a way to lay the ground for a rug against future depositors
> 
> So to my eyes this finding highlights the consequences of a lack of the `initializer` modifier, while the other is the usual `initializer can be frontrun` non critical finding

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001299037):**

> @kbrizzle to clarify: you won’t be frontrun with your deployment as the deploy + initialize is done in one tx. But the `Collateral`  not having `initializer` can be used by the deployer for malicious purposes because what was perceived as an `unchangeable` token can actually be changed if you set up `initialize` with the factory address set to 0

**[kbrizzle (Perennial) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001301453):**

> @Alex the Entreprenerd I see, that makes sense from the perspective of the token seeming like it should be immutable 👍
> 
> FWIW in this scenario the deployer would have to run the risk of someone else initializing and taking admin for the duration that the malicious initial token was active - so I’m not sure how feasible that would be.
> 
> That being said, I think a `UInitializable` would be a great addition to our lib anyways, so let’s go this route since this does seem like a solution with better guarantees. Thanks for the explanation!

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/13#issuecomment-1001304373):**

> The attack is dependent upon external conditions (malicious deployer, nobody else calling initialize, setting up malicious accounting), for that reason (as per the docs) I believe medium severity to be proper.

[](#m-03-chainlinks-latestrounddata-might-return-stale-or-incorrect-results)[\[M-03\] Chainlink’s `latestRoundData` might return stale or incorrect results](https://github.com/code-423n4/2021-12-perennial-findings/issues/24)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug, also found by cmichel, defsec, and ye0lde_

[https://github.com/code-423n4/2021-12-perennial/blob/fd7c38823833a51ae0c6ae3856a3d93a7309c0e4/protocol/contracts/oracle/ChainlinkOracle.sol#L50-L60](https://github.com/code-423n4/2021-12-perennial/blob/fd7c38823833a51ae0c6ae3856a3d93a7309c0e4/protocol/contracts/oracle/ChainlinkOracle.sol#L50-L60)

    function sync() public {
        (, int256 feedPrice, , uint256 timestamp, ) = feed.latestRoundData();
        Fixed18 price = Fixed18Lib.ratio(feedPrice, SafeCast.toInt256(_decimalOffset));
    
        if (priceAtVersion.length == 0 || timestamp > timestampAtVersion[currentVersion()] + minDelay) {
            priceAtVersion.push(price);
            timestampAtVersion.push(timestamp);
    
            emit Version(currentVersion(), timestamp, price);
        }
    }

On `ChainlinkOracle.sol`, we are using `latestRoundData`, but there is no check if the return value indicates stale data. This could lead to stale prices according to the Chainlink documentation:

*   [https://docs.chain.link/docs/historical-price-data/#historical-rounds](https://docs.chain.link/docs/historical-price-data/#historical-rounds)
*   [https://docs.chain.link/docs/faq/#how-can-i-check-if-the-answer-to-a-round-is-being-carried-over-from-a-previous-round](https://docs.chain.link/docs/faq/#how-can-i-check-if-the-answer-to-a-round-is-being-carried-over-from-a-previous-round)

#### [](#recommendation)Recommendation

Consider adding missing checks for stale data.

For example:

    (uint80 roundID, int256 feedPrice, , uint256 timestamp, uint80 answeredInRound) = feed.latestRoundData();
    require(feedPrice > 0, "Chainlink price <= 0"); 
    require(answeredInRound >= roundID, "Stale price");
    require(timestamp != 0, "Round not complete");

**[kbrizzle (Perennial) confirmed](https://github.com/code-423n4/2021-12-perennial-findings/issues/24)**

**[Alex the Entreprenerd (judge) commented](https://github.com/code-423n4/2021-12-perennial-findings/issues/24#issuecomment-1001295232):**

> Agree with the finding, while you can get started with Chainlink’s feed can be used with one line of code, in a production environment it is best to ensure that the data is fresh and within rational bounds

[](#low-risk-findings-6)Low Risk Findings (6)
=============================================

*   [\[L-02\] Not verified function inputs of public / external functions](https://github.com/code-423n4/2021-12-perennial-findings/issues/11) _Submitted by robee_
*   [\[L-03\] On updating the Incentive fee greater than UFixedLib18.ONE, new Programs can not be created](https://github.com/code-423n4/2021-12-perennial-findings/issues/72) _Submitted by hubble_
*   [\[L-04\] Missing fee parameter validation](https://github.com/code-423n4/2021-12-perennial-findings/issues/50) _Submitted by cmichel, also found by 0x1f8b and defsec_
*   [\[L-05\] Fixed18 conversions don’t work for all values](https://github.com/code-423n4/2021-12-perennial-findings/issues/54) _Submitted by cmichel, also found by WatchPug_
*   [\[L-06\] `Factory.sol#updateController()` Lack of input validation](https://github.com/code-423n4/2021-12-perennial-findings/issues/35) _Submitted by WatchPug_
*   [\[L-01\] `Incentivizer.sol` Tokens with fee on transfer are not supported](https://github.com/code-423n4/2021-12-perennial-findings/issues/36) _Submitted by WatchPug_

[](#non-critical-findings-5)Non-Critical Findings (5)
=====================================================

*   [\[N-05\] Unsecure Ownership Transfer](https://github.com/code-423n4/2021-12-perennial-findings/issues/12) _Submitted by 0x1f8b, also found by robee_
*   [\[N-01\] Unused imports](https://github.com/code-423n4/2021-12-perennial-findings/issues/1) _Submitted by robee_
*   [\[N-02\] Solidity compiler versions mismatch](https://github.com/code-423n4/2021-12-perennial-findings/issues/10) _Submitted by robee_
*   [\[N-03\] Initialization functions can be front-run](https://github.com/code-423n4/2021-12-perennial-findings/issues/71) _Submitted by broccolirob, also found by leastwood, cmichel, and WatchPug_
*   [\[N-04\] Removing redundant code can save gas (Collateral, Factory, Incentivizer, ChainlinkOracle)](https://github.com/code-423n4/2021-12-perennial-findings/issues/41) _Submitted by ye0lde_

[](#gas-optimizations-22)Gas Optimizations (22)
===============================================

*   [\[G-01\] claimFee loop does not check for zero transfer amount (Incentivizer.sol)](https://github.com/code-423n4/2021-12-perennial-findings/issues/43) _Submitted by ye0lde_
*   [\[G-02\] Cache storage read and call results in the stack can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/33) _Submitted by WatchPug, also found by gzeon_
*   [\[G-03\] Cache array length in for loops can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/31) _Submitted by WatchPug, also found by 0x0x0x, pmerkleplant, and robee_
*   [\[G-04\] Unnecessary checked arithmetic in for loops](https://github.com/code-423n4/2021-12-perennial-findings/issues/34) _Submitted by WatchPug, also found by robee_
*   [\[G-05\] Reuse operation results can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/32) _Submitted by WatchPug, also found by robee_
*   [\[G-06\] Use immutable variables can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/29) _Submitted by WatchPug, also found by robee_
*   [\[G-07\] Best Practice: public functions not used by current contract should be external](https://github.com/code-423n4/2021-12-perennial-findings/issues/37) _Submitted by WatchPug, also found by robee_
*   [\[G-09\] Avoid unnecessary arithmetic operations can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/20) _Submitted by WatchPug, also found by cmichel_
*   [\[G-10\] Adding unchecked directive can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/57) _Submitted by WatchPug_
*   [\[G-11\] Cache storage variables in the stack can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/40) _Submitted by WatchPug_
*   [\[G-12\] Remove unnecessary variables can make the code simpler and save some gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/39) _Submitted by WatchPug_
*   [\[G-13\] Inline unnecessary function can make the code simpler and save some gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/38) _Submitted by WatchPug_
*   [\[G-14\] Avoid unnecessary `SafeCast.toInt256()` can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/30) _Submitted by WatchPug_
*   [\[G-15\] Adding a new method `provider.currentPrice()` can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/27) _Submitted by WatchPug_
*   [\[G-16\] Avoid unnecessary external calls can save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/26) _Submitted by WatchPug_
*   [\[G-17\] `Token18.sol#balanceOf()` When `isEther()`, `fromTokenAmount()` is unnecessary](https://github.com/code-423n4/2021-12-perennial-findings/issues/23) _Submitted by WatchPug_
*   [\[G-18\] `Token18.sol#push()` When `isEther()`, `toTokenAmount()` is unnecessary](https://github.com/code-423n4/2021-12-perennial-findings/issues/22) _Submitted by WatchPug_
*   [\[G-19\] `10 ** 18` can be changed to `1e18` and save some gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/21) _Submitted by WatchPug_
*   [\[G-20\] `Collateral.sol#maintananceInvariant` can be combined with `collateralnvarant` to save gas](https://github.com/code-423n4/2021-12-perennial-findings/issues/70) _Submitted by 0x0x0x_
*   [\[G-21\] At `Product.sol#closeAll`, cache `_position[account]`](https://github.com/code-423n4/2021-12-perennial-findings/issues/65) _Submitted by 0x0x0x_
*   [\[G-22\] `NotControllerOwnerError` error not used](https://github.com/code-423n4/2021-12-perennial-findings/issues/52) _Submitted by cmichel_
*   [\[G-08\] At settleAccountInternal, check whether the position can be changeable to pre more efficiently](https://github.com/code-423n4/2021-12-perennial-findings/issues/66) _Submitted by 0x0x0x_

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }