![Phuture Finance](/static/08fd81cbc35ad0dd322db98a35e71280/34ca5/phuture.png)

Phuture Finance contest  
Findings & Analysis Report
====================================================

#### 2022-6-16

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [High Risk Findings (2)](#high-risk-findings-2)
    
    *   [\[H-01\] `IndexLogic`: An attacker can mint tokens for himself using assets deposited by other users](#h-01-indexlogic-an-attacker-can-mint-tokens-for-himself-using-assets-deposited-by-other-users)
    *   [\[H-02\] `UniswapV2PriceOracle.sol` `currentCumulativePrices()` will revert when `priceCumulative` addition overflow](#h-02-uniswapv2priceoraclesol-currentcumulativeprices-will-revert-when-pricecumulative-addition-overflow)
*   [Medium Risk Findings (8)](#medium-risk-findings-8)
    
    *   [\[M-01\] Index managers can rug user funds](#m-01-index-managers-can-rug-user-funds)
    *   [\[M-02\] Chainlink’s `latestRoundData` might return stale or incorrect results](#m-02-chainlinks-latestrounddata-might-return-stale-or-incorrect-results)
    *   [\[M-03\] Inactive skipped assets can be drained from the index](#m-03-inactive-skipped-assets-can-be-drained-from-the-index)
    *   [\[M-04\] Wrong requirement in reweight function (`ManagedIndexReweightingLogic.sol`)](#m-04-wrong-requirement-in-reweight-function-managedindexreweightinglogicsol)
    *   [\[M-05\] Asset Manager can update existing `_assetAggregator`](#m-05-asset-manager-can-update-existing-_assetaggregator)
    *   [\[M-06\] Duplicate asset can be added](#m-06-duplicate-asset-can-be-added)
    *   [\[M-07\] Tokens with fee on transfer are not supported](#m-07-tokens-with-fee-on-transfer-are-not-supported)
    *   [\[M-08\] Wrong `shareChange()` function (`vToken.sol`)](#m-08-wrong-sharechange-function-vtokensol)
*   [Low Risk and Non-Critical Issues](#low-risk-and-non-critical-issues)
    
    *   [L-01 `require()` should be used instead of `assert()`](#l-01-require-should-be-used-instead-of-assert)
    *   [L-02 Incorrect comment](#l-02-incorrect-comment)
    *   [L-03 Unbounded loops with external calls](#l-03-unbounded-loops-with-external-calls)
    *   [L-04 Insufficient input validation](#l-04-insufficient-input-validation)
    *   [L-05 Registries should have ability to have per-index overrides](#l-05-registries-should-have-ability-to-have-per-index-overrides)
    *   [L-06 Uniswap DOS](#l-06-uniswap-dos)
    *   [N-01 Adding a `return` statement when the function defines a named return variable, is redundant](#n-01-adding-a-return-statement-when-the-function-defines-a-named-return-variable-is-redundant)
    *   [N-02 `require()`/`revert()` statements should have descriptive reason strings](#n-02-requirerevert-statements-should-have-descriptive-reason-strings)
    *   [N-03 `constant`s should be defined rather than using magic numbers](#n-03-constants-should-be-defined-rather-than-using-magic-numbers)
    *   [N-04 Use bit shifts in an imutable variable rather than long bit masks of a single bit, for readability](#n-04-use-bit-shifts-in-an-imutable-variable-rather-than-long-bit-masks-of-a-single-bit-for-readability)
    *   [N-05 Use a more recent version of solidity](#n-05-use-a-more-recent-version-of-solidity)
    *   [N-06 Variable names that consist of all capital letters should be reserved for `const`/`immutable` variables](#n-06-variable-names-that-consist-of-all-capital-letters-should-be-reserved-for-constimmutable-variables)
    *   [N-07 File is missing NatSpec](#n-07-file-is-missing-natspec)
    *   [N-08 NatSpec is incomplete](#n-08-natspec-is-incomplete)
    *   [N-09 Event is missing `indexed` fields](#n-09-event-is-missing-indexed-fields)
    *   [N-10 Typos](#n-10-typos)
    *   [N-11 Use of sensitive/non-inclusive terms](#n-11-use-of-sensitivenon-inclusive-terms)
*   [Gas Optimizations](#gas-optimizations)
    
    *   [G-01 State variables only set in the constructor should be declared `immutable`](#g-01-state-variables-only-set-in-the-constructor-should-be-declared-immutable)
    *   [G-02 State variables can be packed into fewer storage slots](#g-02-state-variables-can-be-packed-into-fewer-storage-slots)
    *   [G-03 State variables should be cached in stack variables rather than re-reading them from storage](#g-03-state-variables-should-be-cached-in-stack-variables-rather-than-re-reading-them-from-storage)
    *   [G-04 Result of static calls should be cached in stack variables rather than re-calling storage-touching functions](#g-04-result-of-static-calls-should-be-cached-in-stack-variables-rather-than-re-calling-storage-touching-functions)
    *   [G-05 `x = x + y` is cheaper than `x += y`](#g-05-x--x--y-is-cheaper-than-x--y)
    *   [G-06 `<array>.length` should not be looked up in every loop of a `for`\-loop](#g-06-arraylength-should-not-be-looked-up-in-every-loop-of-a-for-loop)
    *   [G-07 `++i`/`i++` should be `unchecked{++i}`/`unchecked{++i}` when it is not possible for them to overflow, as is the case when used in `for`\- and `while`\-loops](#g-07-ii-should-be-uncheckediuncheckedi-when-it-is-not-possible-for-them-to-overflow-as-is-the-case-when-used-in-for--and-while-loops)
    *   [G-08 `require()`/`revert()` strings longer than 32 bytes cost extra gas](#g-08-requirerevert-strings-longer-than-32-bytes-cost-extra-gas)
    *   [G-09 Not using the named return variables when a function returns, wastes deployment gas](#g-09-not-using-the-named-return-variables-when-a-function-returns-wastes-deployment-gas)
    *   [G-10 Using `> 0` costs more gas than `!= 0` when used on a `uint` in a `require()` statement](#g-10-using--0-costs-more-gas-than--0-when-used-on-a-uint-in-a-require-statement)
    *   [G-11 It costs more gas to initialize variables to zero than to let the default of zero be applied](#g-11-it-costs-more-gas-to-initialize-variables-to-zero-than-to-let-the-default-of-zero-be-applied)
    *   [G-12 `++i` costs less gas than `++i`, especially when it’s used in `for`\-loops (`--i`/`i--` too)](#g-12-i-costs-less-gas-than-i-especially-when-its-used-in-for-loops---ii---too)
    *   [G-13 Splitting `require()` statements that use `&&` saves gas](#g-13-splitting-require-statements-that-use--saves-gas)
    *   [G-14 Usage of `uints`/`ints` smaller than 32 bytes (256 bits) incurs overhead](#g-14-usage-of-uintsints-smaller-than-32-bytes-256-bits-incurs-overhead)
    *   [G-15 Expressions for constant values such as a call to `keccak256()`, should use `immutable` rather than `constant`](#g-15-expressions-for-constant-values-such-as-a-call-to-keccak256-should-use-immutable-rather-than-constant)
    *   [G-16 Duplicated `require()`/`revert()` checks should be refactored to a modifier or function](#g-16-duplicated-requirerevert-checks-should-be-refactored-to-a-modifier-or-function)
    *   [G-17 `require()` or `revert()` statements that check input arguments should be at the top of the function](#g-17-require-or-revert-statements-that-check-input-arguments-should-be-at-the-top-of-the-function)
    *   [G-18 Use custom errors rather than `revert()`/`require()` strings to save deployment gas](#g-18-use-custom-errors-rather-than-revertrequire-strings-to-save-deployment-gas)
    *   [G-19 Functions guaranteed to revert when called by normal users can be marked `payable`](#g-19-functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)
    *   [G-20 Use a more recent version of solidity](#g-20-use-a-more-recent-version-of-solidity)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 audit contest is an event in which community participants, referred to as Wardens, review, audit, or analyze smart contract logic in exchange for a bounty provided by sponsoring projects.

During the audit contest outlined in this document, C4 conducted an analysis of the Phuture Finance smart contract system written in Solidity. The audit contest took place between April 19—April 21 2022.

[](#wardens)Wardens
-------------------

45 Wardens contributed reports to the Phuture Finance contest:

1.  [WatchPug](https://twitter.com/WatchPug_) ([jtp](https://github.com/jack-the-pug) and [ming](https://github.com/mingwatch))
2.  TrungOre
3.  [csanuragjain](https://twitter.com/csanuragjain)
4.  IllIllI
5.  robee
6.  [Kenshin](https://twitter.com/nonfungiblenero)
7.  hyh
8.  cccz
9.  [pedroais](https://twitter.com/Pedroais2/)
10.  [defsec](https://twitter.com/defsec_)
11.  [joestakey](https://twitter.com/JoeStakey)
12.  [Dravee](https://twitter.com/JustDravee)
13.  [abhinavmir](https://twitter.com/abhinavmir)
14.  0xkatana
15.  [Tadashi](https://github.com/htadashi)
16.  kenta
17.  fatima\_naz
18.  0xDjango
19.  [rayn](https://twitter.com/rayn731)
20.  [gzeon](https://twitter.com/gzeon)
21.  [0v3rf10w](https://twitter.com/_0v3rf10w)
22.  [ellahi](https://twitter.com/ellahinator)
23.  minhquanym
24.  TerrierLover
25.  oyc\_109
26.  [z3s](https://github.com/z3s/)
27.  kebabsec (okkothejawa and [FlameHorizon](https://twitter.com/FlameHorizon1))
28.  [foobar](https://twitter.com/0xfoobar)
29.  [fatherOfBlocks](https://twitter.com/father0fBl0cks)
30.  xpriment626
31.  [sseefried](http://seanseefried.org/blog)
32.  [0xNazgul](https://twitter.com/0xNazgul)
33.  [Tomio](https://twitter.com/meidhiwirara)
34.  slywaters
35.  [rfa](https://www.instagram.com/riyan_rfa/)
36.  [windhustler](https://www.linkedin.com/in/jkoncurat/)
37.  simon135
38.  [MaratCerby](https://twitter.com/MaratCerby)
39.  [berndartmueller](https://twitter.com/berndartmueller)
40.  [jah](https://twitter.com/jah_s3)
41.  peritoflores
42.  reassor
43.  [tabish](https://twitter.com/tabishjshaikh)

This contest was judged by the Float Capital team: [moose-code](https://github.com/moose-code) and [JasoonS](https://github.com/JasoonS).

Final report assembled by [liveactionllama](https://twitter.com/liveactionllama).

[](#summary)Summary
===================

The C4 analysis yielded an aggregated total of 10 unique vulnerabilities. Of these vulnerabilities, 2 received a risk rating in the category of HIGH severity and 8 received a risk rating in the category of MEDIUM severity.

Additionally, C4 analysis included 25 reports detailing issues with a risk rating of LOW severity or non-critical. There were also 28 reports recommending gas optimizations.

All of the issues presented here are linked back to their original finding.

[](#scope)Scope
===============

The code under review can be found within the [C4 Phuture Finance contest repository](https://github.com/code-423n4/2022-04-phuture), and is composed of 21 smart contracts written in the Solidity programming language and includes 1,260 lines of Solidity code.

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

[](#high-risk-findings-2)High Risk Findings (2)
===============================================

[](#h-01-indexlogic-an-attacker-can-mint-tokens-for-himself-using-assets-deposited-by-other-users)[\[H-01\] `IndexLogic`: An attacker can mint tokens for himself using assets deposited by other users](https://github.com/code-423n4/2022-04-phuture-findings/issues/19)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cccz, also found by hyh, Kenshin, pedroais, and TrungOre_

In the mint function of the IndexLogic contract, users are required to transfer assets to vToken in advance, and then call the mint function to mint tokens. The attacker can monitor the asset balance in the vToken contract. When the balance is greater than lastBalance, the attacker can call the mint function to mint tokens for himself.

### [](#proof-of-concept)Proof of Concept

[IndexLogic.sol#L48](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/IndexLogic.sol#L48)  

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Call the transferfrom function in the mint function of the IndexLogic contract to transfer the user’s assets.

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/19)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/19#issuecomment-1123844013):**

> We don’t expect users to directly call the Mint/Burn functions on Index. Instead, they should use the Router contract, as our frontend does.

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/19#issuecomment-1134800163):**

> There is no mention of the router contract in the contest documentation and this is unreasonable for wardens to know about the Router.  

> `We would like wardens to focus on any core functional logic, boundary case errors or similar issues which could be utilized by an attacker to take funds away from clients who have funds deposited in the protocol.`  

> This a core logic error that could be used to take funds away from clients and given there is no mention of the router and only part of the code is submitted, I am siding with the wardens on this and awarding in full.

* * *

[](#h-02-uniswapv2priceoraclesol-currentcumulativeprices-will-revert-when-pricecumulative-addition-overflow)[\[H-02\] `UniswapV2PriceOracle.sol` `currentCumulativePrices()` will revert when `priceCumulative` addition overflow](https://github.com/code-423n4/2022-04-phuture-findings/issues/62)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by WatchPug_

[UniswapV2PriceOracle.sol#L62](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PriceOracle.sol#L62)  

    (uint price0Cumulative, uint price1Cumulative, uint32 blockTimestamp) = address(pair).currentCumulativePrices();

Because the Solidity version used by the current implementation of `UniswapV2OracleLibrary.sol` is `>=0.8.7`, and there are some breaking changes in Solidity v0.8.0:

> Arithmetic operations revert on underflow and overflow.

Ref: [https://docs.soliditylang.org/en/v0.8.13/080-breaking-changes.html#silent-changes-of-the-semantics](https://docs.soliditylang.org/en/v0.8.13/080-breaking-changes.html#silent-changes-of-the-semantics)

While in `UniswapV2OracleLibrary.sol`, subtraction overflow is desired at `blockTimestamp - blockTimestampLast` in `currentCumulativePrices()`:

[https://github.com/Uniswap/v2-periphery/blob/master/contracts/libraries/UniswapV2OracleLibrary.sol#L25-L33](https://github.com/Uniswap/v2-periphery/blob/master/contracts/libraries/UniswapV2OracleLibrary.sol#L25-L33)

    if (blockTimestampLast != blockTimestamp) {
        // subtraction overflow is desired
        uint32 timeElapsed = blockTimestamp - blockTimestampLast;
        // addition overflow is desired
        // counterfactual
        price0Cumulative += uint(FixedPoint.fraction(reserve1, reserve0)._x) * timeElapsed;
        // counterfactual
        price1Cumulative += uint(FixedPoint.fraction(reserve0, reserve1)._x) * timeElapsed;
    }

In another word, `Uniswap/v2-periphery/contracts/libraries/UniswapV2OracleLibrary` only works at solidity < `0.8.0`.

As a result, when `price0Cumulative` or `price1Cumulative` is big enough, `currentCumulativePrices` will revert due to overflow.

### [](#impact)Impact

Since the overflow is desired in the original version, and it’s broken because of using Solidity version >0.8. The `UniswapV2PriceOracle` contract will break when the desired overflow happens, and further breaks other parts of the system that relies on `UniswapV2PriceOracle`.

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Note: this recommended fix requires a fork of the library contract provided by Uniswap.

Change to:

    if (blockTimestampLast != blockTimestamp) {
        unchecked {
            // subtraction overflow is desired
            uint32 timeElapsed = blockTimestamp - blockTimestampLast;
            // addition overflow is desired
            // counterfactual
            price0Cumulative += uint(FixedPoint.fraction(reserve1, reserve0)._x) * timeElapsed;
            // counterfactual
            price1Cumulative += uint(FixedPoint.fraction(reserve0, reserve1)._x) * timeElapsed;
        }
    }

**[jn-lp (Phuture Finance) confirmed and resolved](https://github.com/code-423n4/2022-04-phuture-findings/issues/62)**

* * *

[](#medium-risk-findings-8)Medium Risk Findings (8)
===================================================

[](#m-01-index-managers-can-rug-user-funds)[\[M-01\] Index managers can rug user funds](https://github.com/code-423n4/2022-04-phuture-findings/issues/55)
---------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by IllIllI, also found by Kenshin_

The `ORDERER_ROLE` role has the ability to arbitrarily transfer user funds, and this role is shared between both the `orderer` and people who can rebalance the index.

Even if the owner is benevolent the fact that there is a rug vector available may [negatively impact the protocol’s reputation](https://twitter.com/RugDocIO/status/1411732108029181960). See [this](https://github.com/code-423n4/2021-08-realitycards-findings/issues/73) example where a similar finding has been flagged as a high-severity issue. I’ve downgraded this instance to be a medium since it requires a malicious manager.

### [](#proof-of-concept-1)Proof of Concept

The role is given to the `orderer` so it has the ability to add/remove funds during Uniswap operations: File: contracts/vToken.sol (lines [80-87](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L80-L87))

        /// @inheritdoc IvToken
        function transferFrom(
            address _from,
            address _to,
            uint _shares
        ) external override nonReentrant onlyRole(ORDERER_ROLE) {
            _transfer(_from, _to, _shares);
        }

The role is also required to initiate rebalances: File: contracts/TopNMarketCapIndex.sol (lines [67-68](https://github.com/code-423n4/2022-04-phuture/blob/47cd226c80842585542599a3b56cc2a26b519d8a/contracts/TopNMarketCapIndex.sol#L67-L68))

        /// @notice Reweighs index assets according to the latest market cap data for specified category
        function reweight() external override onlyRole(ORDERER_ROLE) {

File: contracts/TrackedIndex.sol (lines [56-57](https://github.com/code-423n4/2022-04-phuture/blob/47cd226c80842585542599a3b56cc2a26b519d8a/contracts/TrackedIndex.sol#L56-L57))

        /// @notice Reweighs index assets according to the latest market cap data
        function reweight() external override onlyRole(ORDERER_ROLE) {

It is not necessary for the person/tool initiating reweights to also have the ability to arbitrarily transfer funds, so they should be separate roles. If the `orderer` also needs to be able to reweight, the `orderer` should also be given the new role.

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

Split the role into two, and only give the `ORDERER_ROLE` role to the `orderer`.

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/55)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/55#issuecomment-1123794735):**

> `ORDERER_ROLE` role is only given to Orderer contract by multisig, which must have the ability to `reweight` indices as well as to `transferFrom` on vToken contract

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/55#issuecomment-1134791693):**

> I agree with the warden at the very least there is only benefit in splitting this role out appropriately into two roles. There is likely a case where the ordered and index rebalancers aren’t the same.

* * *

[](#m-02-chainlinks-latestrounddata-might-return-stale-or-incorrect-results)[\[M-02\] Chainlink’s `latestRoundData` might return stale or incorrect results](https://github.com/code-423n4/2022-04-phuture-findings/issues/1)
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by cccz, also found by 0xDjango, 0xkatana, berndartmueller, defsec, Dravee, fatima_naz, IllIllI, jah, kebabsec, kenta, pedroais, peritoflores, rayn, reassor, tabish, and WatchPug\_

On ChainlinkPriceOracle.sol, we are using latestRoundData, but there is no check if the return value indicates stale data.

            (, int basePrice, , , ) = baseAggregator.latestRoundData();
            (, int quotePrice, , , ) = assetInfo.aggregator.latestRoundData();

This could lead to stale prices according to the Chainlink documentation:

[https://docs.chain.link/docs/historical-price-data/#historical-rounds](https://docs.chain.link/docs/historical-price-data/#historical-rounds)  
[https://docs.chain.link/docs/faq/#how-can-i-check-if-the-answer-to-a-round-is-being-carried-over-from-a-previous-round](https://docs.chain.link/docs/faq/#how-can-i-check-if-the-answer-to-a-round-is-being-carried-over-from-a-previous-round)

### [](#proof-of-concept-2)Proof of Concept

[ChainlinkPriceOracle.sol#L83-L84](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/ChainlinkPriceOracle.sol#L83-L84)  

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Consider adding missing checks for stale data.

For example:

        (uint80 baseRoundID, int256 basePrice, , uint256 baseTimestamp, uint80 BaseAnsweredInRound) = baseAggregator.latestRoundData();
        (uint80 quoteRoundID, int256 quotePrice, , uint256 quoteTimestamp, uint80 quoteAnsweredInRound) = assetInfo.aggregator.latestRoundData();
        require(BaseAnsweredInRound >= baseRoundID && quoteAnsweredInRound >=  quoteRoundID, "Stale price");
        require(baseTimestamp != 0 && quoteTimestamp != 0 ,"Round not complete");
        require(basePrice > 0 && quotePrice > 0,"Chainlink answer reporting 0");

**[olivermehr (Phuture Finance) confirmed](https://github.com/code-423n4/2022-04-phuture-findings/issues/1)**

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/1#issuecomment-1135808518):**

> Confirming medium issue across the board.

* * *

[](#m-03-inactive-skipped-assets-can-be-drained-from-the-index)[\[M-03\] Inactive skipped assets can be drained from the index](https://github.com/code-423n4/2022-04-phuture-findings/issues/54)
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by IllIllI_

If an index has any inactive assets with the role `SKIPPED_ASSET_ROLE`, a user can repeatedly deposit and withdraw assets, always getting the skipped asset without having to deposit any

### [](#proof-of-concept-3)Proof of Concept

During minting, any asset that has the ‘skipped’ role is excluded from the checks of assets deposited: File: contracts/IndexLogic.sol (lines [60-70](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L60-L70))

            for (uint i; i < inactiveAssets.length(); ++i) {
                if (!IAccessControl(registry).hasRole(SKIPPED_ASSET_ROLE, inactiveAssets.at(i))) {
                    uint lastBalanceInAsset = IvToken(
                        IvTokenFactory(vTokenFactory).createOrReturnVTokenOf(inactiveAssets.at(i))
                    ).lastAssetBalanceOf(address(this));
                    lastAssetBalanceInBase += lastBalanceInAsset.mulDiv(
                        FixedPoint112.Q112,
                        oracle.refreshedAssetPerBaseInUQ(inactiveAssets.at(i))
                    );
                }
            }

During burning, however, there’s a bug that only skips if there are ‘blacklisted’ assets: File: contracts/IndexLogic.sol (lines [125-140](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L125-L140))

            for (uint i; i < length + inactiveAssets.length(); ++i) {
                address asset = i < length ? assets.at(i) : inactiveAssets.at(i - length);
                if (containsBlacklistedAssets && IAccessControl(registry).hasRole(SKIPPED_ASSET_ROLE, asset)) {
                    continue;
                }
    
                IvToken vToken = IvToken(IvTokenFactory(vTokenFactory).vTokenOf(asset));
                uint indexAssetBalance = vToken.balanceOf(address(this));
                uint accountBalance = (value * indexAssetBalance) / totalSupply();
                if (accountBalance == 0) {
                    continue;
                }
    
                // calculate index value in vault to be burned
                vToken.transfer(address(vToken), accountBalance);
                vToken.burn(_recipient);

This means that users will be passed back inactive skipped assets even if they never deposited any.

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

I believe the `&&` was meant to be a `||` in the `SKIPPED_ASSET_ROLE` in the code block directly above. Changing the code to be that way would be the fix.

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/54)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/54#issuecomment-1123811917):**

> That’s totally expected behavior. We want to get rid of the dust of skipped assets in our index.

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/54#issuecomment-1135826801):**

> Awarding the warden here since the documentation of the contest should’ve clearly mentioned that this is intentional behavior for skipped assets to be able to be drained. Well worth the warden bringing this up. This is well within the scope of the contest and it’s possible old assets may not be dust and contain material value.

* * *

[](#m-04-wrong-requirement-in-reweight-function-managedindexreweightinglogicsol)[\[M-04\] Wrong requirement in reweight function (`ManagedIndexReweightingLogic.sol`)](https://github.com/code-423n4/2022-04-phuture-findings/issues/40)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by TrungOre_

[ManagedIndexReweightingLogic.sol#L32](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L32)  
[IIndexRegistry.sol#L19](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IIndexRegistry.sol#L19)  

The list of assets won’t be changed after reweight because of reverted tx.

### [](#proof-of-concept-4)Proof of Concept

`require(_updatedAssets.length <= IIndexRegistry(registry).maxComponents())` when [reweight](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L32) is not true, because as in the [doc](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IIndexRegistry.sol#L19), `maxComponent` is the maximum assets for an index, but `_updatedAssets` also contain the assets that you want to remove. So the comparision makes no sense.

### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

Require `assets.length() <= IIndexRegistry(registry).maxComponents()` at the end of function instead.

**[jn-lp (Phuture Finance) confirmed and resolved](https://github.com/code-423n4/2022-04-phuture-findings/issues/40)**

* * *

[](#m-05-asset-manager-can-update-existing-_assetaggregator)[\[M-05\] Asset Manager can update existing `_assetAggregator`](https://github.com/code-423n4/2022-04-phuture-findings/issues/22)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by csanuragjain_

[ChainlinkPriceOracle.sol#L60](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/ChainlinkPriceOracle.sol#L60)  

Asset Manager can update the aggregator of an existing asset thus impacting all function making use of this asset. Ideally if an aggregator is already set for an asset the function should fail.

### [](#proof-of-concept-5)Proof of Concept

1.  Asset Manager call function addAsset to adds an asset X with assetAggregator value as Y
2.  This is being utilized across application
3.  Now Asset Manager calls the same function addAsset with asset X with assetAggregator value as Z
4.  Asset aggregator value for asset X gets changed to Z even though it was already set to Y

### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

addAsset should only work if assetInfoOf\[\_asset\] value is empty.

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/22)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/22#issuecomment-1123846759):**

> Aggregators often break or are updated to new logic, the manager tracks these changes and sets the value to the current one.

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/22#issuecomment-1135962586):**

> Have to assume that ASSET_MANAGER_ROLE is behaving honestly in the first place otherwise everything falls apart, so this is a centralization issue.
> 
> The big question is who is being given the ASSET_MANAGER_ROLE ? This role has the power to rug everyone in every index.
> 
> Given this is unclear who is given this role (can’t see anything in codebase explicitly on it, no deploy scripts, no documentation on it), one can’t know who is given ASSET_MANAGER_ROLE. Given this assumption, this is a valid finding as basically one asset manager could change the oracle for another asset managers index?
> 
> Going to give this one to the warden for bringing up a valid point.

* * *

[](#m-06-duplicate-asset-can-be-added)[\[M-06\] Duplicate asset can be added](https://github.com/code-423n4/2022-04-phuture-findings/issues/23)
-----------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by csanuragjain_

[ManagedIndex.sol#L35](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/ManagedIndex.sol#L35)  
[TopNMarketCapIndex.sol#L57](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/TopNMarketCapIndex.sol#L57)  
[TrackedIndex.sol#L45](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/TrackedIndex.sol#L45)  

Initialize function can be called multiple times with same asset. Calling with same asset will make duplicate entries in assets list. Any function reading assets will get impacted and would retrieve duplicate asset

### [](#proof-of-concept-6)Proof of Concept

1.  Observe that initialize function can be called multiple times
2.  Admin calls initialize function with asset X
3.  asset X gets added in assets object
4.  Admin again calls initialize function with asset X
5.  asset X again gets added in assets object making duplicate entries

### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Add a check to fail if assets already contains the passed asset argument. Also add a modifier so that initialize could only be called once.

    require(!assets.contain(asset), "Asset already exists");

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/23)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/23#issuecomment-1123743337):**

> We require caller of `initialize` method to be a factory (which is non-upgradable contract), so it can’t be called twice
> 
> _see:_
> 
>     require(msg.sender == factory, "ManagedIndex: FORBIDDEN");

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/23#issuecomment-1135966246):**

> Given the factory contract is not supplied it makes it impossible to know these things and hence siding with the warden for the disclosure.
> 
> ” to be a factory (which is non-upgradable contract)” i.e. one can’t know this if the factory is not supplied or documented.

* * *

[](#m-07-tokens-with-fee-on-transfer-are-not-supported)[\[M-07\] Tokens with fee on transfer are not supported](https://github.com/code-423n4/2022-04-phuture-findings/issues/43)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by robee_

There are ERC20 tokens that charge fee for every transfer() / transferFrom().

Vault.sol#addValue() assumes that the received amount is the same as the transfer amount, and uses it to calculate attributions, balance amounts, etc. But, the actual transferred amount can be lower for those tokens.

### [](#recommended-mitigation-steps-8)Recommended Mitigation Steps

Therefore it’s recommended to use the balance change before and after the transfer instead of the amount. This way you also support the tokens with transfer fee - that are popular.

[IndexLogic.sol#L115](https://github.com/code-423n4/2022-04-phuture/tree/main/contracts/IndexLogic.sol#L115)  

**[olivermehr (Phuture Finance) confirmed](https://github.com/code-423n4/2022-04-phuture-findings/issues/43)**

* * *

[](#m-08-wrong-sharechange-function-vtokensol)[\[M-08\] Wrong `shareChange()` function (`vToken.sol`)](https://github.com/code-423n4/2022-04-phuture-findings/issues/26)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------

_Submitted by TrungOre_

[vToken.sol#L160](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L160)  

Users can get the wrong amount of vToken  
\=> Make users lose their fund

### [](#proof-of-concept-7)Proof of Concept

Base on the code in function `shareChange()` in [vToken.sol](https://github.com/code-423n4/2022-04-phuture/blob/main/contracts/vToken.sol)  
Assume that if `oldShare = totalSupply > 0`,

*   `newShares`

\= `(_amountInAsset * (_totalSupply - oldShares)) / (_assetBalance - availableAssets);`  
\= `(_amountInAsset * (_totalSupply - _totalSupply)) / (_assetBalance - availableAssets);`  
\= `0`  

It make no sense, because if `amountInAsset >> availableAssets`, `newShares` should be bigger than `oldShares`, but in this case `newShares = 0 < oldShares`

### [](#recommended-mitigation-steps-9)Recommended Mitigation Steps

Modify the [line](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L160) from `if (_totalSupply > 0)` to `if (_totalSupply - oldShares > 0)`.

**[olivermehr (Phuture Finance) disputed](https://github.com/code-423n4/2022-04-phuture-findings/issues/26)**

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/26#issuecomment-1126084397):**

> Such a case is considered impossible due to the fact that it can only work with a 0xdead address.

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/26#issuecomment-1135938293):**

> Agree it’s not an issue as on initialization tokens are sent to the burn address making this unlikely. ![image](https://user-images.githubusercontent.com/20556729/170049178-fdb37630-f807-44ac-9808-d42ed5a32102.png)
> 
> However the orderer role could possibly burn the tokens held by the burn address causing this issue to happen.

**[JasoonS (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/26#issuecomment-1137784730):**

> Agree with mitigation step:
> 
> > Modify the [line](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L160) from if (_totalSupply > 0) to if (_totalSupply - oldShares > 0)
> 
> If it were impossible for tokens to be burned from the 0xdead address then this wouldn’t be a concern.
> 
> So although extremely unlikely, this is valid.

* * *

[](#low-risk-and-non-critical-issues)Low Risk and Non-Critical Issues
=====================================================================

For this contest, 25 reports were submitted by wardens detailing low risk and non-critical issues. The [report highlighted below](https://github.com/code-423n4/2022-04-phuture-findings/issues/56) by **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [defsec](https://github.com/code-423n4/2022-04-phuture-findings/issues/71), [robee](https://github.com/code-423n4/2022-04-phuture-findings/issues/38), [abhinavmir](https://github.com/code-423n4/2022-04-phuture-findings/issues/72), [Dravee](https://github.com/code-423n4/2022-04-phuture-findings/issues/12), [hyh](https://github.com/code-423n4/2022-04-phuture-findings/issues/99), [joestakey](https://github.com/code-423n4/2022-04-phuture-findings/issues/92), [Tadashi](https://github.com/code-423n4/2022-04-phuture-findings/issues/82), [Kenshin](https://github.com/code-423n4/2022-04-phuture-findings/issues/35), [foobar](https://github.com/code-423n4/2022-04-phuture-findings/issues/88), [gzeon](https://github.com/code-423n4/2022-04-phuture-findings/issues/77), [0xkatana](https://github.com/code-423n4/2022-04-phuture-findings/issues/8), [kenta](https://github.com/code-423n4/2022-04-phuture-findings/issues/93), [minhquanym](https://github.com/code-423n4/2022-04-phuture-findings/issues/78), [xpriment626](https://github.com/code-423n4/2022-04-phuture-findings/issues/18), [TerrierLover](https://github.com/code-423n4/2022-04-phuture-findings/issues/28), [0v3rf10w](https://github.com/code-423n4/2022-04-phuture-findings/issues/95), [0xDjango](https://github.com/code-423n4/2022-04-phuture-findings/issues/49), [ellahi](https://github.com/code-423n4/2022-04-phuture-findings/issues/86), [fatima\_naz](https://github.com/code-423n4/2022-04-phuture-findings/issues/81), [oyc\_109](https://github.com/code-423n4/2022-04-phuture-findings/issues/17), [rayn](https://github.com/code-423n4/2022-04-phuture-findings/issues/68), [sseefried](https://github.com/code-423n4/2022-04-phuture-findings/issues/94), [z3s](https://github.com/code-423n4/2022-04-phuture-findings/issues/58), and [kebabsec](https://github.com/code-423n4/2022-04-phuture-findings/issues/70)._

[](#l-01-require-should-be-used-instead-of-assert)\[L-01\] `require()` should be used instead of `assert()`
-----------------------------------------------------------------------------------------------------------

1.  File: contracts/IndexLogic.sol (line [72](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L72))

            assert(minAmountInBase != type(uint).max);

[](#l-02-incorrect-comment)\[L-02\] Incorrect comment
-----------------------------------------------------

Transfers the current balance if there is less available, rather than the usual reverting

1.  File: contracts/vToken.sol (line [216](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L216))

        /// @param _amount Amount of assets to transfer

[](#l-03-unbounded-loops-with-external-calls)\[L-03\] Unbounded loops with external calls
-----------------------------------------------------------------------------------------

The interface and the function should require a start index and a lenght, so that the index composition can be fetched in batches without running out of gas. If there are thousands of index components (e.g. like the Wilshire 5000 index), the function may revert

1.  File: contracts/BaseIndex.sol (lines [75-81](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol#L75-L81))

        function anatomy() external view override returns (address[] memory _assets, uint8[] memory _weights) {
            _assets = assets.values();
            _weights = new uint8[](_assets.length);
            for (uint i; i < _assets.length; ++i) {
                _weights[i] = weightOf[_assets[i]];
            }
        }

[](#l-04-insufficient-input-validation)\[L-04\] Insufficient input validation
-----------------------------------------------------------------------------

Checking for length greater than one is useless because the caller can just pass a weighting of zero for the second asset in order to exclude it

1.  File: contracts/ManagedIndexReweightingLogic.sol (line [30](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L30))

                _updatedAssets.length > 1 &&

[](#l-05-registries-should-have-ability-to-have-per-index-overrides)\[L-05\] Registries should have ability to have per-index overrides
---------------------------------------------------------------------------------------------------------------------------------------

If two indexes share the same registry, it’s not possible to separately apply `SKIPPED_ASSET_ROLE` for one but not the other. It’s not always clear during index creation whether there will be circumstances that affect one but not the other index

1.  File: contracts/BaseIndex.sol (line [38](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol#L38))

            registry = IIndexFactory(_factory).registry();

[](#l-06-uniswap-dos)\[L-06\] Uniswap DOS
-----------------------------------------

The `README.md` talks about the fact that the orderer splits up orders to reduce price impact. This means that either the `orderer` has a slippage bounds which can DOSed with [sandwich attacks](https://github.com/code-423n4/2021-04-maple-findings/issues/105), or the code uses some sort of VWAP/TWAP, which can also be gamed with flash loans submitted for every slice of the order

1.  File: contracts/IndexLogic.sol (line [142](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L142))

                    IOrderer(orderer).reduceOrderAsset(asset, totalSupply() - value, totalSupply());

[](#n-01-adding-a-return-statement-when-the-function-defines-a-named-return-variable-is-redundant)\[N-01\] Adding a `return` statement when the function defines a named return variable, is redundant
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/libraries/AUMCalculationLibrary.sol (line [71](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/AUMCalculationLibrary.sol#L71))

            return z_;

2.  File: contracts/libraries/FullMath.sol (line [39](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L39))

                    return result;

3.  File: contracts/libraries/FullMath.sol (line [106](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L106))

                return result;

[](#n-02-requirerevert-statements-should-have-descriptive-reason-strings)\[N-02\] `require()`/`revert()` statements should have descriptive reason strings
----------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/libraries/FullMath.sol (line [35](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L35))

                    require(denominator > 0);

2.  File: contracts/libraries/FullMath.sol (line [44](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L44))

                require(denominator > prod1);

3.  File: contracts/libraries/FullMath.sol (line [123](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L123))

                    require(result < type(uint256).max);

[](#n-03-constants-should-be-defined-rather-than-using-magic-numbers)\[N-03\] `constant`s should be defined rather than using magic numbers
-------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/IndexLogic.sol (line [82](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L82))

                _mint(address(0xdead), IndexLibrary.INITIAL_QUANTITY);

2.  File: contracts/libraries/FullMath.sol (line [88](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L88))

                uint256 inv = (3 * denominator) ^ 2;

[](#n-04-use-bit-shifts-in-an-imutable-variable-rather-than-long-bit-masks-of-a-single-bit-for-readability)\[N-04\] Use bit shifts in an imutable variable rather than long bit masks of a single bit, for readability
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/libraries/FixedPoint112.sol (line [10](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FixedPoint112.sol#L10))

        uint256 internal constant Q112 = 0x10000000000000000000000000000;

[](#n-05-use-a-more-recent-version-of-solidity)\[N-05\] Use a more recent version of solidity
---------------------------------------------------------------------------------------------

Use a solidity version of at least 0.8.12 to get `string.concat()` to be used instead of `abi.encodePacked(<str>,<str>)`

1.  File: contracts/ManagedIndex.sol (line [3](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol#L3))

    pragma solidity >=0.8.7;

[](#n-06-variable-names-that-consist-of-all-capital-letters-should-be-reserved-for-constimmutable-variables)\[N-06\] Variable names that consist of all capital letters should be reserved for `const`/`immutable` variables
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If the variable needs to be different based on which class it comes from, a `view`/`pure` _function_ should be used instead (e.g. like [this](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/76eee35971c2541585e05cbf258510dda7b2fbc6/contracts/token/ERC20/extensions/draft-IERC20Permit.sol#L59)).

1.  File: contracts/ManagedIndex.sol (line [17](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol#L17))

        bytes32 private REWEIGHT_INDEX_ROLE;

2.  File: contracts/vToken.sol (line [41](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L41))

        NAV.Data internal _NAV;

[](#n-07-file-is-missing-natspec)\[N-07\] File is missing NatSpec
-----------------------------------------------------------------

1.  File: contracts/interfaces/external/IChainLinkFeed.sol (line [0](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/external/IChainLinkFeed.sol#L0))

    // SPDX-License-Identifier: GPL-2.0-or-later

2.  File: contracts/interfaces/external/IWETH.sol (line [0](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/external/IWETH.sol#L0))

    // SPDX-License-Identifier: GPL-2.0-or-later

[](#n-08-natspec-is-incomplete)\[N-08\] NatSpec is incomplete
-------------------------------------------------------------

1.  File: contracts/interfaces/IChainlinkPriceOracle.sol (lines [10-13](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IChainlinkPriceOracle.sol#L10-L13))

        /// @notice Adds `_asset` to the oracle
        /// @param _asset Asset's address
        /// @param _asset Asset aggregator's address
        function addAsset(address _asset, address _assetAggregator) external;

Missing: `@param _assetAggregator`

2.  File: contracts/interfaces/IFeePool.sol (lines [8-10](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IFeePool.sol#L8-L10))

        /// @notice Minting fee in base point format
        /// @return Returns minting fee in base point (BP) format
        function mintingFeeInBPOf(address _index) external view returns (uint16);

Missing: `@param _index`

3.  File: contracts/interfaces/IFeePool.sol (lines [12-14](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IFeePool.sol#L12-L14))

        /// @notice Burning fee in base point format
        /// @return Returns burning fee in base point (BP) format
        function burningFeeInBPOf(address _index) external view returns (uint16);

Missing: `@param _index`

4.  File: contracts/interfaces/IFeePool.sol (lines [16-18](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IFeePool.sol#L16-L18))

        /// @notice AUM scaled per seconds rate
        /// @return Returns AUM scaled per seconds rate
        function AUMScaledPerSecondsRateOf(address _index) external view returns (uint);

Missing: `@param _index`

5.  File: contracts/interfaces/IPriceOracle.sol (lines [8-10](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IPriceOracle.sol#L8-L10))

        /// @notice Updates and returns asset per base
        /// @return Asset per base in UQ
        function refreshedAssetPerBaseInUQ(address _asset) external returns (uint);

Missing: `@param _asset`

6.  File: contracts/interfaces/IPriceOracle.sol (lines [12-14](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IPriceOracle.sol#L12-L14))

        /// @notice Returns last asset per base
        /// @return Asset per base in UQ
        function lastAssetPerBaseInUQ(address _asset) external view returns (uint);

Missing: `@param _asset`

7.  File: contracts/interfaces/IvTokenFactory.sol (lines [8-10](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IvTokenFactory.sol#L8-L10))

        /// @notice Creates or returns address of previously created vToken for the given asset
        /// @param _asset Asset to create or return vToken for
        function createOrReturnVTokenOf(address _asset) external returns (address);

Missing: `@return`

8.  File: contracts/interfaces/IvToken.sol (lines [72-74](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IvToken.sol#L72-L74))

        /// @notice Returns amount of assets for the given account with the given shares amount
        /// @return Amount of assets for the given account with the given shares amount
        function assetDataOf(address _account, uint _shares) external view returns (AssetData memory);

Missing: `@param _account` `@param _shares`

9.  File: contracts/libraries/NAV.sol (lines [18-26](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L18-L26))

        /// @notice Transfer `_amount` of shares between given addresses
        /// @param _from Account to send shares from
        /// @param _to Account to send shares to
        /// @param _amount Amount of shares to send
        function transfer(
            Data storage self,
            address _from,
            address _to,
            uint _amount

Missing: `@param self`

10.  File: contracts/libraries/NAV.sol (lines [34-40](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L34-L40))

        /// @param _balance New shares maximum limit
        /// @param _recipient Recipient that will receive minted shares
        function mint(
            Data storage self,
            uint _balance,
            address _recipient
        ) internal returns (uint shares) {

Missing: `@return`

11.  File: contracts/libraries/NAV.sol (lines [54-56](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L54-L56))

        /// @param self Data structure reference
        /// @param _balance Shares balance
        function burn(Data storage self, uint _balance) internal returns (uint amount) {

Missing: `@return`

[](#n-09-event-is-missing-indexed-fields)\[N-09\] Event is missing `indexed` fields
-----------------------------------------------------------------------------------

Each `event` should use three `indexed` fields if there are three or more fields

1.  File: contracts/interfaces/IAnatomyUpdater.sol (line [8](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IAnatomyUpdater.sol#L8))

        event UpdateAnatomy(address asset, uint8 weight);

2.  File: contracts/interfaces/IvToken.sol (line [13](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IvToken.sol#L13))

        event VTokenTransfer(address indexed from, address indexed to, uint amount);

[](#n-10-typos)\[N-10\] Typos
-----------------------------

1.  File: contracts/interfaces/IAnatomyUpdater.sol (line [6](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IAnatomyUpdater.sol#L6))

    /// @notice Contains event for aatomy update

aatomy

2.  File: contracts/interfaces/IReweightableIndex.sol (line [5](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/interfaces/IReweightableIndex.sol#L5))

    /// @title Rewightable index interface

Rewightable

3.  File: contracts/libraries/FullMath.sol (line [101](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L101))

                // correct result modulo 2**256. Since the precoditions guarantee

precoditions

4.  File: contracts/vToken.sol (line [84](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L84))

Why is this one named `_shares` whereas the others are named `_amount`

            uint _shares

[](#n-11-use-of-sensitivenon-inclusive-terms)\[N-11\] Use of sensitive/non-inclusive terms
------------------------------------------------------------------------------------------

Rename to `constainsBlockedAssets`

1.  File: contracts/IndexLogic.sol (line [101](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L101))

            bool containsBlacklistedAssets;

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/56#issuecomment-1134585301):**

> Excellent report. Well thought out, deep understanding.

* * *

[](#gas-optimizations)Gas Optimizations
=======================================

For this contest, 28 reports were submitted by wardens detailing gas optimizations. The [report highlighted below](https://github.com/code-423n4/2022-04-phuture-findings/issues/57) by **IllIllI** received the top score from the judge.

_The following wardens also submitted reports: [defsec](https://github.com/code-423n4/2022-04-phuture-findings/issues/69), [joestakey](https://github.com/code-423n4/2022-04-phuture-findings/issues/89), [Dravee](https://github.com/code-423n4/2022-04-phuture-findings/issues/11), [fatherOfBlocks](https://github.com/code-423n4/2022-04-phuture-findings/issues/25), [robee](https://github.com/code-423n4/2022-04-phuture-findings/issues/39), [0xNazgul](https://github.com/code-423n4/2022-04-phuture-findings/issues/14), [0v3rf10w](https://github.com/code-423n4/2022-04-phuture-findings/issues/98), [0xkatana](https://github.com/code-423n4/2022-04-phuture-findings/issues/7), [Kenshin](https://github.com/code-423n4/2022-04-phuture-findings/issues/36), [Tomio](https://github.com/code-423n4/2022-04-phuture-findings/issues/75), [ellahi](https://github.com/code-423n4/2022-04-phuture-findings/issues/85), [TrungOre](https://github.com/code-423n4/2022-04-phuture-findings/issues/47), [fatima\_naz](https://github.com/code-423n4/2022-04-phuture-findings/issues/80), [gzeon](https://github.com/code-423n4/2022-04-phuture-findings/issues/76), [kenta](https://github.com/code-423n4/2022-04-phuture-findings/issues/91), [oyc\_109](https://github.com/code-423n4/2022-04-phuture-findings/issues/16), [slywaters](https://github.com/code-423n4/2022-04-phuture-findings/issues/10), [rfa](https://github.com/code-423n4/2022-04-phuture-findings/issues/84), [windhustler](https://github.com/code-423n4/2022-04-phuture-findings/issues/73), [Tadashi](https://github.com/code-423n4/2022-04-phuture-findings/issues/83), [TerrierLover](https://github.com/code-423n4/2022-04-phuture-findings/issues/29), [minhquanym](https://github.com/code-423n4/2022-04-phuture-findings/issues/79), [simon135](https://github.com/code-423n4/2022-04-phuture-findings/issues/13), [z3s](https://github.com/code-423n4/2022-04-phuture-findings/issues/59), [0xDjango](https://github.com/code-423n4/2022-04-phuture-findings/issues/50), [MaratCerby](https://github.com/code-423n4/2022-04-phuture-findings/issues/21), and [rayn](https://github.com/code-423n4/2022-04-phuture-findings/issues/61)._

[](#g-01-state-variables-only-set-in-the-constructor-should-be-declared-immutable)\[G-01\] State variables only set in the constructor should be declared `immutable`
---------------------------------------------------------------------------------------------------------------------------------------------------------------------

Avoids a Gsset (20000 gas)

1.  File: contracts/ManagedIndex.sol (line [17](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol#L17))

        bytes32 private REWEIGHT_INDEX_ROLE;

2.  File: contracts/PhuturePriceOracle.sol (line [24](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L24))

        address public base;

3.  File: contracts/PhuturePriceOracle.sol (line [27](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L27))

        address public registry;

4.  File: contracts/PhuturePriceOracle.sol (line [33](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L33))

        uint8 private baseDecimals;

[](#g-02-state-variables-can-be-packed-into-fewer-storage-slots)\[G-02\] State variables can be packed into fewer storage slots
-------------------------------------------------------------------------------------------------------------------------------

If variables occupying the same slot are both written the same function or by the constructor, avoids a separate Gsset (20000 gas). Reads of the variables are also cheaper

1.  File: contracts/PhuturePriceOracle.sol (line [24](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L24))

        address public base;

Variable ordering with 3 slots instead of the current 4:  
mapping(32):priceOracleOf, address(20):base, uint8(1):baseDecimals, address(20):registry

[](#g-03-state-variables-should-be-cached-in-stack-variables-rather-than-re-reading-them-from-storage)\[G-03\] State variables should be cached in stack variables rather than re-reading them from storage
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The instances below point to the second access of a state variable within a function. Caching will replace each Gwarmaccess (100 gas) with a much cheaper stack read.  
Less obvious optimizations include having local storage variables of mappings within state variable mappings or mappings within state variable structs, having local storage variables of structs within mappings, or having local caches of state variable contracts/addresses.

1.  File: contracts/PhuturePriceOracle.sol (line [84](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L84))

            return IPriceOracle(priceOracleOf[_asset]).refreshedAssetPerBaseInUQ(_asset);

2.  File: contracts/PhuturePriceOracle.sol (line [94](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L94))

            return IPriceOracle(priceOracleOf[_asset]).lastAssetPerBaseInUQ(_asset);

3.  File: contracts/UniswapV2PathPriceOracle.sol (line [35](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L35))

(save `asset` pointer for next iteration of the loop)

                address asset = path[i + 1];

4.  File: contracts/UniswapV2PathPriceOracle.sol (line [50](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L50))

(save `asset` pointer for next iteration of the loop)

                address asset = path[i + 1];

5.  File: contracts/UniswapV2PriceOracle.sol (line [51](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PriceOracle.sol#L51))

            uint32 timeElapsed = blockTimestamp - blockTimestampLast;

6.  File: contracts/vToken.sol (line [219](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L219))

            IERC20(asset).safeTransfer(_recipient, Math.min(_amount, balance));

[](#g-04-result-of-static-calls-should-be-cached-in-stack-variables-rather-than-re-calling-storage-touching-functions)\[G-04\] Result of static calls should be cached in stack variables rather than re-calling storage-touching functions
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Caching will replace each Gwarmaccess (100 gas) with a much cheaper stack read.

1.  File: contracts/IndexLogic.sol (line [41](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L41))

                if (weightOf[assets.at(i)] == 0) {

2.  File: contracts/ManagedIndexReweightingLogic.sol (line [40](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L40))

                uint availableAssets = IvToken(IvTokenFactory(vTokenFactory).createOrReturnVTokenOf(assets.at(i)))

3.  File: contracts/TopNMarketCapReweightingLogic.sol (line [39](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L39))

                uint availableAssets = IvToken(IvTokenFactory(vTokenFactory).createOrReturnVTokenOf(assets.at(i)))

[](#g-05-x--x--y-is-cheaper-than-x--y)\[G-05\] `x = x + y` is cheaper than `x += y`
-----------------------------------------------------------------------------------

1.  File: contracts/libraries/NAV.sol (line [28](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L28))

            self.balanceOf[_from] -= _amount;

2.  File: contracts/libraries/NAV.sol (line [29](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L29))

            self.balanceOf[_to] += _amount;

[](#g-06-arraylength-should-not-be-looked-up-in-every-loop-of-a-for-loop)\[G-06\] `<array>.length` should not be looked up in every loop of a `for`\-loop
---------------------------------------------------------------------------------------------------------------------------------------------------------

Even memory arrays incur the overhead of bit tests and bit shifts to calculate the array length. Storage array length checks incur an extra Gwarmaccess (100 gas) PER-LOOP.

1.  File: contracts/BaseIndex.sol (line [78](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol#L78))

            for (uint i; i < _assets.length; ++i) {

2.  File: contracts/ManagedIndexReweightingLogic.sol (line [50](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L50))

            for (uint i; i < _updatedAssets.length; ++i) {

3.  File: contracts/ManagedIndexReweightingLogic.sol (line [96](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L96))

            for (uint i; i < _inactiveAssets.length; ++i) {

4.  File: contracts/ManagedIndex.sol (line [30](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol#L30))

            for (uint i; i < _assets.length; ++i) {

5.  File: contracts/TopNMarketCapIndex.sol (line [48](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol#L48))

            for (uint i; i < _assets.length; ++i) {

6.  File: contracts/TopNMarketCapReweightingLogic.sol (line [104](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L104))

            for (uint i; i < _inactiveAssets.length; ++i) {

7.  File: contracts/TrackedIndex.sol (line [35](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndex.sol#L35))

            for (uint i; i < _assets.length; ++i) {

[](#g-07-ii-should-be-uncheckediuncheckedi-when-it-is-not-possible-for-them-to-overflow-as-is-the-case-when-used-in-for--and-while-loops)\[G-07\] `++i`/`i++` should be `unchecked{++i}`/`unchecked{++i}` when it is not possible for them to overflow, as is the case when used in `for`\- and `while`\-loops
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/BaseIndex.sol (line [78](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol#L78))

            for (uint i; i < _assets.length; ++i) {

2.  File: contracts/IndexLogic.sol (line [39](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L39))

            for (uint i; i < assets.length(); ++i) {

3.  File: contracts/IndexLogic.sol (line [60](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L60))

            for (uint i; i < inactiveAssets.length(); ++i) {

4.  File: contracts/IndexLogic.sol (line [102](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L102))

            for (uint i; i < length; ++i) {

5.  File: contracts/IndexLogic.sol (line [125](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L125))

            for (uint i; i < length + inactiveAssets.length(); ++i) {

6.  File: contracts/ManagedIndexReweightingLogic.sol (line [38](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L38))

            for (uint i; i < assets.length(); ++i) {

7.  File: contracts/ManagedIndexReweightingLogic.sol (line [50](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L50))

            for (uint i; i < _updatedAssets.length; ++i) {

8.  File: contracts/ManagedIndexReweightingLogic.sol (line [96](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L96))

            for (uint i; i < _inactiveAssets.length; ++i) {

9.  File: contracts/ManagedIndex.sol (line [30](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol#L30))

            for (uint i; i < _assets.length; ++i) {

10.  File: contracts/TopNMarketCapIndex.sol (line [48](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol#L48))

            for (uint i; i < _assets.length; ++i) {

11.  File: contracts/TopNMarketCapReweightingLogic.sol (line [37](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L37))

            for (uint i; i < assets.length(); ++i) {

12.  File: contracts/TopNMarketCapReweightingLogic.sol (line [51](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L51))

            for (uint _i; _i < diff.assetCount; ++_i) {

13.  File: contracts/TopNMarketCapReweightingLogic.sol (line [104](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L104))

            for (uint i; i < _inactiveAssets.length; ++i) {

14.  File: contracts/TrackedIndexReweightingLogic.sol (line [37](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndexReweightingLogic.sol#L37))

            for (uint i; i < assets.length(); ++i) {

15.  File: contracts/TrackedIndexReweightingLogic.sol (line [66](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndexReweightingLogic.sol#L66))

            for (uint i; i < assets.length(); ++i) {

16.  File: contracts/TrackedIndex.sol (line [35](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndex.sol#L35))

            for (uint i; i < _assets.length; ++i) {

17.  File: contracts/UniswapV2PathPriceOracle.sol (line [34](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L34))

            for (uint i = 0; i < path.length - 1; i++) {

18.  File: contracts/UniswapV2PathPriceOracle.sol (line [49](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L49))

            for (uint i = 0; i < path.length - 1; i++) {

[](#g-08-requirerevert-strings-longer-than-32-bytes-cost-extra-gas)\[G-08\] `require()`/`revert()` strings longer than 32 bytes cost extra gas
----------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/TopNMarketCapIndex.sol (line [74](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol#L74))

                    revert("TopNMarketCapIndex: REWEIGH_FAILED");

2.  File: contracts/TopNMarketCapReweightingLogic.sol (line [67](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L67))

                    require(IAccessControl(registry).hasRole(ASSET_ROLE, asset), "TopNMarketCapIndex: INVALID_ASSET");

3.  File: contracts/UniswapV2PathPriceOracle.sol (line [25](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L25))

            require(_oracles.length == _path.length - 1, "UniswapV2PathPriceOracle: ORACLES");

[](#g-09-not-using-the-named-return-variables-when-a-function-returns-wastes-deployment-gas)\[G-09\] Not using the named return variables when a function returns, wastes deployment gas
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/vToken.sol (line [91](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L91))

            return _mint(msg.sender);

2.  File: contracts/vToken.sol (line [96](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L96))

            return _burn(_recipient);

[](#g-10-using--0-costs-more-gas-than--0-when-used-on-a-uint-in-a-require-statement)\[G-10\] Using `> 0` costs more gas than `!= 0` when used on a `uint` in a `require()` statement
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/IndexLogic.sol (line [76](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L76))

                require(lastAssetBalanceInBase > 0, "Index: INSUFFICIENT_AMOUNT");

2.  File: contracts/IndexLogic.sol (line [98](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L98))

            require(value > 0, "Index: INSUFFICIENT_AMOUNT");

3.  File: contracts/libraries/FullMath.sol (line [35](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol#L35))

                    require(denominator > 0);

4.  File: contracts/libraries/IndexLibrary.sol (line [29](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/IndexLibrary.sol#L29))

            require(_assetPerBaseInUQ > 0, "IndexLibrary: ORACLE");

5.  File: contracts/libraries/NAV.sol (line [49](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L49))

            require(shares > 0, "NAV: INSUFFICIENT_AMOUNT");

6.  File: contracts/libraries/NAV.sol (line [59](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol#L59))

            require(amount > 0, "NAV: INSUFFICIENT_SHARES_BURNED");

[](#g-11-it-costs-more-gas-to-initialize-variables-to-zero-than-to-let-the-default-of-zero-be-applied)\[G-11\] It costs more gas to initialize variables to zero than to let the default of zero be applied
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/UniswapV2PathPriceOracle.sol (line [34](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L34))

            for (uint i = 0; i < path.length - 1; i++) {

2.  File: contracts/UniswapV2PathPriceOracle.sol (line [49](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L49))

            for (uint i = 0; i < path.length - 1; i++) {

[](#g-12-i-costs-less-gas-than-i-especially-when-its-used-in-for-loops---ii---too)\[G-12\] `++i` costs less gas than `++i`, especially when it’s used in `for`\-loops (`--i`/`i--` too)
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/UniswapV2PathPriceOracle.sol (line [34](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L34))

            for (uint i = 0; i < path.length - 1; i++) {

2.  File: contracts/UniswapV2PathPriceOracle.sol (line [49](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol#L49))

            for (uint i = 0; i < path.length - 1; i++) {

[](#g-13-splitting-require-statements-that-use--saves-gas)\[G-13\] Splitting `require()` statements that use `&&` saves gas
---------------------------------------------------------------------------------------------------------------------------

See [this issue](https://github.com/code-423n4/2022-01-xdefi-findings/issues/128) for an example

1.  File: contracts/ChainlinkPriceOracle.sol (line [51](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ChainlinkPriceOracle.sol#L51))

            require(_baseAggregator != address(0) && _base != address(0), "ChainlinkPriceOracle: ZERO");

2.  File: contracts/ChainlinkPriceOracle.sol (line [86](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ChainlinkPriceOracle.sol#L86))

            require(basePrice > 0 && quotePrice > 0, "ChainlinkPriceOracle: NEGATIVE");

3.  File: contracts/ManagedIndexReweightingLogic.sol (lines [29-34](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L29-L34))

            require(
                _updatedAssets.length > 1 &&
                    _updatedWeights.length == _updatedAssets.length &&
                    _updatedAssets.length <= IIndexRegistry(registry).maxComponents(),
                "ManagedIndex: INVALID"
            );

4.  File: contracts/UniswapV2PriceOracle.sol (line [46](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PriceOracle.sol#L46))

            require(reserve0 != 0 && reserve1 != 0, "UniswapV2PriceOracle: RESERVES");

[](#g-14-usage-of-uintsints-smaller-than-32-bytes-256-bits-incurs-overhead)\[G-14\] Usage of `uints`/`ints` smaller than 32 bytes (256 bits) incurs overhead
------------------------------------------------------------------------------------------------------------------------------------------------------------

> When using elements that are smaller than 32 bytes, your contract’s gas usage may be higher. This is because the EVM operates on 32 bytes at a time. Therefore, if the element is smaller than that, the EVM must use more operations in order to reduce the size of the element from 32 bytes to the desired size.

[https://docs.soliditylang.org/en/v0.8.11/internals/layout\_in\_storage.html](https://docs.soliditylang.org/en/v0.8.11/internals/layout_in_storage.html)  
Use a larger size then downcast where needed

See [original submission](https://github.com/code-423n4/2022-04-phuture-findings/issues/57) for instances.

[](#g-15-expressions-for-constant-values-such-as-a-call-to-keccak256-should-use-immutable-rather-than-constant)\[G-15\] Expressions for constant values such as a call to `keccak256()`, should use `immutable` rather than `constant`
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

See [this](https://github.com/ethereum/solidity/issues/9232) issue for a detail description of the issue

1.  File: contracts/BaseIndex.sol (line [25](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol#L25))

        bytes32 internal constant INDEX_MANAGER_ROLE = keccak256("INDEX_MANAGER_ROLE");

2.  File: contracts/ChainlinkPriceOracle.sol (line [29](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ChainlinkPriceOracle.sol#L29))

        bytes32 private constant ASSET_MANAGER_ROLE = keccak256("ASSET_MANAGER_ROLE");

3.  File: contracts/IndexLogic.sol (line [25](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L25))

        bytes32 internal constant ASSET_ROLE = keccak256("ASSET_ROLE");

4.  File: contracts/IndexLogic.sol (line [27](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol#L27))

        bytes32 internal constant SKIPPED_ASSET_ROLE = keccak256("SKIPPED_ASSET_ROLE");

5.  File: contracts/ManagedIndexReweightingLogic.sol (line [25](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol#L25))

        bytes32 internal constant ASSET_ROLE = keccak256("ASSET_ROLE");

6.  File: contracts/PhuturePriceOracle.sol (line [21](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L21))

        bytes32 private constant ASSET_MANAGER_ROLE = keccak256("ASSET_MANAGER_ROLE");

7.  File: contracts/TopNMarketCapIndex.sol (line [18](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol#L18))

        bytes32 internal constant ORDERER_ROLE = keccak256("ORDERER_ROLE");

8.  File: contracts/TopNMarketCapReweightingLogic.sol (line [27](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol#L27))

        bytes32 internal constant ASSET_ROLE = keccak256("ASSET_ROLE");

9.  File: contracts/TrackedIndexReweightingLogic.sol (line [25](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndexReweightingLogic.sol#L25))

        bytes32 internal constant ASSET_ROLE = keccak256("ASSET_ROLE");

10.  File: contracts/TrackedIndex.sol (line [17](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndex.sol#L17))

        bytes32 internal constant ORDERER_ROLE = keccak256("ORDERER_ROLE");

11.  File: contracts/vToken.sol (line [27](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L27))

        bytes32 private constant INDEX_ROLE = keccak256("INDEX_ROLE");

12.  File: contracts/vToken.sol (line [29](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L29))

        bytes32 private constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

13.  File: contracts/vToken.sol (line [31](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L31))

        bytes32 private constant ORDERER_ROLE = keccak256("ORDERER_ROLE");

14.  File: contracts/vToken.sol (line [33](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L33))

        bytes32 private constant RESERVE_MANAGER_ROLE = keccak256("RESERVE_MANAGER_ROLE");

[](#g-16-duplicated-requirerevert-checks-should-be-refactored-to-a-modifier-or-function)\[G-16\] Duplicated `require()`/`revert()` checks should be refactored to a modifier or function
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/PhuturePriceOracle.sol (line [83](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L83))

            require(priceOracleOf[_asset] != address(0), "PhuturePriceOracle: UNSET");

[](#g-17-require-or-revert-statements-that-check-input-arguments-should-be-at-the-top-of-the-function)\[G-17\] `require()` or `revert()` statements that check input arguments should be at the top of the function
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Checks that involve constants should come before checks that involve state variables

1.  File: contracts/ChainlinkPriceOracle.sol (line [62](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ChainlinkPriceOracle.sol#L62))

            require(_asset != address(0), "ChainlinkPriceOracle: ZERO");

2.  File: contracts/PhuturePriceOracle.sol (line [47](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L47))

            require(_base != address(0), "PhuturePriceOracle: ZERO");

3.  File: contracts/vToken.sol (line [60](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L60))

            require(_asset != address(0), "vToken: ZERO");

[](#g-18-use-custom-errors-rather-than-revertrequire-strings-to-save-deployment-gas)\[G-18\] Use custom errors rather than `revert()`/`require()` strings to save deployment gas
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

1.  File: contracts/BaseIndex.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/BaseIndex.sol))
2.  File: contracts/ChainlinkPriceOracle.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ChainlinkPriceOracle.sol))
3.  File: contracts/IndexLogic.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/IndexLogic.sol))
4.  File: contracts/libraries/FullMath.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/FullMath.sol))
5.  File: contracts/libraries/IndexLibrary.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/IndexLibrary.sol))
6.  File: contracts/libraries/NAV.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/libraries/NAV.sol))
7.  File: contracts/ManagedIndexReweightingLogic.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndexReweightingLogic.sol))
8.  File: contracts/ManagedIndex.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/ManagedIndex.sol))
9.  File: contracts/PhuturePriceOracle.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol))
10.  File: contracts/TopNMarketCapIndex.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol))
11.  File: contracts/TopNMarketCapReweightingLogic.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapReweightingLogic.sol))
12.  File: contracts/TrackedIndexReweightingLogic.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndexReweightingLogic.sol))
13.  File: contracts/TrackedIndex.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndex.sol))
14.  File: contracts/UniswapV2PathPriceOracle.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PathPriceOracle.sol))
15.  File: contracts/UniswapV2PriceOracle.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/UniswapV2PriceOracle.sol))
16.  File: contracts/vToken.sol (Various lines throughout the [file](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol))

[](#g-19-functions-guaranteed-to-revert-when-called-by-normal-users-can-be-marked-payable)\[G-19\] Functions guaranteed to revert when called by normal users can be marked `payable`
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

If a function modifier such as `onlyOwner` is used, the function will revert if a normal user tries to pay the function. Marking the function as `payable` will lower the gas cost for legitimate callers because the compiler will not include checks for whether a payment was provided.

1.  File: contracts/PhuturePriceOracle.sol (line [55](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L55))

        function setOracleOf(address _asset, address _oracle) external override onlyRole(ASSET_MANAGER_ROLE) {

2.  File: contracts/PhuturePriceOracle.sol (line [62](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/PhuturePriceOracle.sol#L62))

        function removeOracleOf(address _asset) external override onlyRole(ASSET_MANAGER_ROLE) {

3.  File: contracts/TopNMarketCapIndex.sol (line [68](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TopNMarketCapIndex.sol#L68))

        function reweight() external override onlyRole(ORDERER_ROLE) {

4.  File: contracts/TrackedIndex.sol (line [57](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/TrackedIndex.sol#L57))

        function reweight() external override onlyRole(ORDERER_ROLE) {

5.  File: contracts/vToken.sol (lines [81-85](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L81-L85))

        function transferFrom(
            address _from,
            address _to,
            uint _shares
        ) external override nonReentrant onlyRole(ORDERER_ROLE) {

6.  File: contracts/vToken.sol (line [90](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L90))

        function mint() external override nonReentrant onlyRole(INDEX_ROLE) returns (uint shares) {

7.  File: contracts/vToken.sol (line [95](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L95))

        function burn(address _recipient) external override nonReentrant onlyRole(INDEX_ROLE) returns (uint amount) {

8.  File: contracts/vToken.sol (line [100](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L100))

        function mintFor(address _recipient) external override nonReentrant onlyRole(ORDERER_ROLE) returns (uint) {

9.  File: contracts/vToken.sol (line [105](https://github.com/code-423n4/2022-04-phuture/blob/594459d0865fb6603ba388b53f3f01648f5bb6fb/contracts/vToken.sol#L105))

        function burnFor(address _recipient) external override nonReentrant onlyRole(ORDERER_ROLE) returns (uint) {

[](#g-20-use-a-more-recent-version-of-solidity)\[G-20\] Use a more recent version of solidity
---------------------------------------------------------------------------------------------

Use a solidity version of at least 0.8.10 to have external calls skip contract existence checks if the external call has a return value

See [original submission](https://github.com/code-423n4/2022-04-phuture-findings/issues/57) for instances.

**[jn-lp (Phuture Finance) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/57#issuecomment-1116353260):**

> More than half of the issues were very helpful, thanks!

**[moose-code (judge) commented](https://github.com/code-423n4/2022-04-phuture-findings/issues/57#issuecomment-1134754095):**

> Very comprehensive, lots of good things here!

* * *

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 Contests incentivize the discovery of exploits, vulnerabilities, and bugs in smart contracts. Security researchers are rewarded at an increasing rate for finding higher-risk issues. Contest submissions are judged by a knowledgeable security researcher and solidity developer and disclosed to sponsoring developers. C4 does not conduct formal verification regarding the provided code but instead provides final verification.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk4 { color: #569CD6; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk8 { color: #CE9178; } .dark-default-dark .mtk10 { color: #4EC9B0; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }