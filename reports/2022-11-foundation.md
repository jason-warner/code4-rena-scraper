![Foundation](/static/75306e03585b3fe5db01bdbf319ee6e6/4e333/foundation.jpg)

Foundation Exhibition, Scheduling & Early Access Solo Audit by Lambda  
Findings & Analysis Report
==================================================================================================

#### 2022-12-14

Table of contents
-----------------

*   [Overview](#overview)
    
    *   [About C4](#about-c4)
    *   [Wardens](#wardens)
*   [Summary](#summary)
*   [Scope](#scope)
*   [Severity Criteria](#severity-criteria)
*   [Medium Risk Findings (3)](#medium-risk-findings-3)
    
    *   [M-01 `MarketFees`: Seller referrer fee not paid when no creator royalty recipients exist for a sale](#m-01-marketfees-seller-referrer-fee-not-paid-when-no-creator-royalty-recipients-exist-for-a-sale)
    *   [M-02 `MarketFees`: Primary sales not detected in some scenarios](#m-02-marketfees-primary-sales-not-detected-in-some-scenarios)
    *   [M-03 `MarketFees`: Seller referrer fee can underflow](#m-03-marketfees-seller-referrer-fee-can-underflow)
*   [Informational Findings (7)](#informational-findings-7)
    
    *   [Info-01 `NFTMarketExhibition`: `_getAndRemoveNftFromExhibition` does not emit `NftRemovedFromExhibition`](#info-01-nftmarketexhibition-_getandremovenftfromexhibition-does-not-emit-nftremovedfromexhibition)
    *   [Info-02 `NFTMarketExhibition`: Behavior of `getExhibition` for non-existing exhibition IDs](#info-02-nftmarketexhibition-behavior-of-getexhibition-for-non-existing-exhibition-ids)
    *   [Info-03 `NFTMarketReserveAuction`: Event `ReserveAuctionCreated` does not include exhibition ID](#info-03-nftmarketreserveauction-event-reserveauctioncreated-does-not-include-exhibition-id)
    *   [Info-04 `NFTDropMarketFixedPriceSale`: Provided start times can be arbitrarily far in the future](#info-04-nftdropmarketfixedpricesale-provided-start-times-can-be-arbitrarily-far-in-the-future)
    *   [Info-05 `NFTDropMarketFixedPriceSale`: `getFixedPriceSale` may return 0 for `generalAvailabilityStartTime` of valid sale](#info-05-nftdropmarketfixedpricesale-getfixedpricesale-may-return-0-for-generalavailabilitystarttime-of-valid-sale)
    *   [Info-06 `NFTDropMarketFixedPriceSale`: Fixed merkle root per sale may be restricting](#info-06-nftdropmarketfixedpricesale-fixed-merkle-root-per-sale-may-be-restricting)
    *   [Info-07 Undocumented parameters](#info-07-undocumented-parameters)
*   [Gas Optimizations (1)](#gas-optimizations-1)
    
    *   [G-01 `NFTMarketExhibition.createExhibition`: Unnecessary storage read](#g-01-nftmarketexhibitioncreateexhibition-unnecessary-storage-read)
*   [Disclosures](#disclosures)

[](#overview)Overview
=====================

[](#about-c4)About C4
---------------------

Code4rena (C4) is an open organization consisting of security researchers, auditors, developers, and individuals with domain expertise in smart contracts.

A C4 Solo Audit is an event where a top Code4rena contributor, commonly referred to as a warden or a team, reviews, audits and analyzes smart contract logic in exchange for a bounty provided by sponsoring projects.

During the Solo Audit outlined in this document, C4 conducted an analysis of the Foundation code. The audit took place between November 21-28, 2022.

[](#wardens)Wardens
-------------------

Audit completed by Lambda.

Final report assembled by [itsmetechjay](https://twitter.com/itsmetechjay).

[](#summary)Summary
===================

The Foundation Exhibition, Scheduling & Early Access Solo Audit yielded 3 MEDIUM vulnerabilities. There were also 7 informational findings and 1 gas optimization reported.

The codebase in question had already undergone two prior Code4rena contests. Since the last audit, exhibitions (listing NFTs with a curator that gets part of the final sale price) and the possibility to set early access periods for drop markets were added.

[](#scope)Scope
===============

Code reviewed consisted of the following contracts:

Contract Name

SLOC

Purpose

[NFTDropMarket](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/NFTDropMarket.sol)

63

The main / top-level contract for all drop market tools on Foundation.

[FoundationTreasuryNode](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/FoundationTreasuryNode.sol)

34

A wrapper for communicating with the treasury contract which collects Foundation fees and defines the central roles.

[FETHNode](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/FETHNode.sol)

35

A wrapper for communicating with the FETH contract.

[MarketSharedCore](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/MarketSharedCore.sol)

7

A base class for Foundation market contracts to define functions that other market contract may implement or extend.

[NFTDropMarketCore](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftDropMarket/NFTDropMarketCore.sol)

4

A base class for the drop specific market contract to define functions that other mixins may implement or extend.

[SendValueWithFallbackWithdraw](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/SendValueWithFallbackWithdraw.sol)

19

A helper function to handle funds transfers.

[MarketFees](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/MarketFees.sol)

331

Distributes revenue from sales.

[Gap500](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/Gap500.sol)

4

A placeholder contract leaving room for new mixins to be added to the future in an upgrade safe fashion.

[Gap10000](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/Gap10000.sol)

4

A placeholder contract leaving room for new mixins to be added to the future in an upgrade safe fashion.

[NFTDropMarketFixedPriceSale](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol)

253

Allows creators to list a drop collection for sale at a fixed price point.

[ArrayLibrary](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/libraries/ArrayLibrary.sol)

17

Helper functions for resizing arrays.

[Constants](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/shared/Constants.sol)

10

Shared constant values used by various mixins.

[MerkleAddressLibrary](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/libraries/MerkleAddressLibrary.sol)

9

A wrapper for validating merkle proofs for a tree containing a list of addresses.

[TimeLibrary](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/libraries/TimeLibrary.sol)

9

Simple time checks to improve code readability & ensure consistency.

[ExhibitionMarketMock](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/ExhibitionMarketMock.sol)

63

A subset of the NFTMarket contract including auctions & exhibitions.

[NFTMarketCore](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftMarket/NFTMarketCore.sol)

44

A base class for the market contract to define functions that other mixins may implement or extend.

[NFTMarketExhibition](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftMarket/NFTMarketExhibition.sol)

127

Adds exhibitions to the marketplace.

[NFTMarketAuction](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftMarket/NFTMarketAuction.sol)

14

A base for reserve auctions which may be shared with other auction types in the future.

[NFTMarketReserveAuction](https://github.com/f8n/fnd-contracts-staging/tree/master/contracts/mixins/nftMarket/NFTMarketReserveAuction.sol)

319

Adds support for reserve auctions to the marketplace.

**Total** 19 files

1,366

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

[](#medium-risk-findings-3)Medium Risk Findings (3)
===================================================

[](#m-01-marketfees-seller-referrer-fee-not-paid-when-no-creator-royalty-recipients-exist-for-a-sale)\[M-01\] `MarketFees`: Seller referrer fee not paid when no creator royalty recipients exist for a sale
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The logic to calculate the seller referrer fee is within the following `if` block:

        if (creatorRecipients.length != 0 || assumePrimarySale) {
          ...
        }

When `creatorRecipients.length == 0` and `assumePrimarySale == false` (which is the case for `ExhibitionMarketMock`), the returned `sellerReferrerFee` will always be zero, no matter which value is passed for `sellerReferrerTakeRateInBasisPoints`. Therefore, the exhibition curator will not get the configured fee in such a scenario, although the seller referral fee should not depend on the existence of creator royalty recipients.

### [](#link-to-affected-code)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L530](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L530)

### [](#recommended-mitigation-steps)Recommended Mitigation Steps

Calculate the seller referrer fee also when no creator royalty recipients are defined (like it is done for the buyer referrer fee).

[](#m-02-marketfees-primary-sales-not-detected-in-some-scenarios)\[M-02\] `MarketFees`: Primary sales not detected in some scenarios
------------------------------------------------------------------------------------------------------------------------------------

When the seller is also a recipient of the creator royalties, a primary sale is assumed and `sellerRev` is set to 0:

                if (creatorRecipients[i] == seller) {
                  // If the seller is any of the recipients defined, assume a primary sale
                  creatorRev += sellerRev;
                  sellerRev = 0;
                }

However, this loop is exited prematurely when one of the `creatorShares` entries is greater than `BASIS_POINTS`:

                if (creatorShares[i] > BASIS_POINTS) {
                  // If the numbers are >100% we ignore the fee recipients and pay just the first instead
                  totalShares = 0;
                  break;
                }

Therefore, there can be scenarios where it is not detected that the seller is a recipient of the creator royalties and a secondary sale is assumed. For instance, if `creatorRecipients` is `[address(Bob), address(Alice), seller]` and `creatorShares` is `[100, 10_001, 100]`, the loop will `break` in the second iteration and `sellerRev` will not be set to 0.

### [](#link-to-affected-code-1)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L555](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L555)

### [](#recommended-mitigation-steps-1)Recommended Mitigation Steps

Continue looping to detect if the seller is a creator royalty recipient, even if one `creatorShares` entry was invalid.

[](#m-03-marketfees-seller-referrer-fee-can-underflow)\[M-03\] `MarketFees`: Seller referrer fee can underflow
--------------------------------------------------------------------------------------------------------------

In `MarketFees._getFees`, the `sellerReferrerFee` is deducted from `creatorRev` or `sellerRev` (depending on if the sale is primary / secondary):

          if (sellerReferrerTakeRateInBasisPoints != 0) {
            sellerReferrerFee = (price * sellerReferrerTakeRateInBasisPoints) / BASIS_POINTS;
    
            // Subtract the seller referrer fee from the seller revenue so we do not double pay.
            if (sellerRev == 0) {
              // If the seller revenue is 0, this is a primary sale where all seller revenue is attributed to the "creator".
              creatorRev -= sellerReferrerFee;
            } else {
              sellerRev -= sellerReferrerFee;
            }
          }

`sellerReferrerTakeRateInBasisPoints` can be up to 5,000 (50%), because the exhibition take rate (which is the only case when a non-zero value is passed) needs to be smaller than `MAX_TAKE_RATE`. On the other hand, it is only enforced that the protocol fee plus the creator royalty percentage is smaller than 100%:

        if (
          protocolFeeInBasisPoints < BASIS_POINTS / BUY_REFERRER_FEE_DENOMINATOR ||
          protocolFeeInBasisPoints + BASIS_POINTS / CREATOR_ROYALTY_DENOMINATOR >= BASIS_POINTS
        ) {
          /* If the protocol fee is invalid, revert:
           * Protocol fee must be greater than the buy referrer fee since referrer fees are deducted from the protocol fee.
           * The protocol fee must leave room for the creator royalties.
           */
          revert NFTMarketFees_Invalid_Protocol_Fee();
        }

Because of that, there are valid settings where the calculation will underflow, leading to sales that do not succeed. For instance, we can have a protocol fee of 20% and creator royalties of 35%, in which case `sellerRev` would be 45% of the overall price. If the exhibition take rate is then >45%, the calculation will underflow.

### [](#link-to-affected-code-2)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L534](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/shared/MarketFees.sol#L534)

### [](#recommended-mitigation-steps-2)Recommended Mitigation Steps

There are two options to solve the problem:

*   Enforce that the protocol fee plus the creator royalty percentage is less than 50%.
*   Handle the underflow case explicitly and for instance cap the seller referrer fee if it would exceed the seller revenue.

[](#informational-findings-7)Informational Findings (7)
=======================================================

[](#info-01-nftmarketexhibition-_getandremovenftfromexhibition-does-not-emit-nftremovedfromexhibition)\[Info-01\] `NFTMarketExhibition`: `_getAndRemoveNftFromExhibition` does not emit `NftRemovedFromExhibition`
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Unlike the function `_removeNftFromExhibition`, `_getAndRemoveNftFromExhibition` does not emit the event `NftRemovedFromExhibition` when an NFT is removed from an exhibition. This can be problematic for blockchain indexing solutions that rely on events (for instance, to track which NFTs are listed in which exhibition), as they will not detect the removal when an NFT is sold via a reserve auction.

### [](#link-to-affected-code-3)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketExhibition.sol#L199](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketExhibition.sol#L199)

### [](#recommended-mitigation-steps-3)Recommended Mitigation Steps

Also emit the event in `_getAndRemoveNftFromExhibition`

[](#info-02-nftmarketexhibition-behavior-of-getexhibition-for-non-existing-exhibition-ids)\[Info-02\] `NFTMarketExhibition`: Behavior of `getExhibition` for non-existing exhibition IDs
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

When a non-existing exhibition ID is passed to `getExhibition`, the default values (empty string, `address(0)`, and 0) will be returned for all parameters. Because of that, it may not be clear for integrators how to check the existence of an exhibition. As an empty string is a valid value for the name and the take rate can be 0, the only reliable way is to check if the curator is equal to `address(0)`. If an integrator decides to use another value, the check will be unreliable.

### [](#link-to-affected-code-4)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketExhibition.sol#L224](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketExhibition.sol#L224)

### [](#recommended-mitigation-steps-4)Recommended Mitigation Steps

Either revert for non-existing exhibitions or document clearly how a non-existing exhibition will be returned.

[](#info-03-nftmarketreserveauction-event-reserveauctioncreated-does-not-include-exhibition-id)\[Info-03\] `NFTMarketReserveAuction`: Event `ReserveAuctionCreated` does not include exhibition ID
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The event `ReserveAuctionCreated` that is emitted within `createReserveAuctionV2` does not include the exhibition ID. Because the exhibition ID determines the seller referrer fee, this information may be important for blockchain indexing solutions or other applications that consume these events.

### [](#link-to-affected-code-5)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketReserveAuction.sol#L309](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketReserveAuction.sol#L309)

### [](#recommended-mitigation-steps-5)Recommended Mitigation Steps

Consider adding the exhibition ID to the event.

[](#info-04-nftdropmarketfixedpricesale-provided-start-times-can-be-arbitrarily-far-in-the-future)\[Info-04\] `NFTDropMarketFixedPriceSale`: Provided start times can be arbitrarily far in the future
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

While `_createFixedPriceSale` validates that the provided start times (early access and general availability) are not in the past, they can be arbitrarily far (up to February 2106) in the future. Therefore, when a user submits a completely wrong timestamp by mistake, the sale will still be created.

### [](#link-to-affected-code-6)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L295](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L295)

### [](#recommended-mitigation-steps-6)Recommended Mitigation Steps

To catch user errors, consider adding an upper limit on the time delta (for instance 4 years).

[](#info-05-nftdropmarketfixedpricesale-getfixedpricesale-may-return-0-for-generalavailabilitystarttime-of-valid-sale)\[Info-05\] `NFTDropMarketFixedPriceSale`: `getFixedPriceSale` may return 0 for `generalAvailabilityStartTime` of valid sale
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

As an optimization, `_createFixedPriceSale` does not store the `generalAvailabilityStartTime` when it is equal to the current block timestamp (because the business logic does not need the value then):

        if (generalAvailabilityStartTime != block.timestamp) {
          // If starting now we don't need to write to storage
          saleConfig.generalAvailabilityStartTime = generalAvailabilityStartTime.toUint32();
        }

However, this also means that `getFixedPriceSale` will set `generalAvailabilityStartTime` to 0 for such sales. Therefore, there is for instance no way to figure out the time that has passed since the general availability start time (which applications that build on top of Foundation might want to do) in these scenarios.

### [](#link-to-affected-code-7)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L361](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L361)

### [](#recommended-mitigation-steps-7)Recommended Mitigation Steps

Consider still setting `generalAvailabilityStartTime` in these cases, even if gas usage increases slightly.

[](#info-06-nftdropmarketfixedpricesale-fixed-merkle-root-per-sale-may-be-restricting)\[Info-06\] `NFTDropMarketFixedPriceSale`: Fixed merkle root per sale may be restricting
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The creator of a sale cannot add a new merkle root for a sale or change the current one. This may be very restricting in some scenarios. For instance, it could happen that an error occurred during the calculation of the root or that one address needs to be changed (for instance, because a user lost his private key).

### [](#link-to-affected-code-8)Link To Affected Code

[https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L367](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftDropMarket/NFTDropMarketFixedPriceSale.sol#L367)

### [](#recommended-mitigation-steps-8)Recommended Mitigation Steps

According to a comment in `NFTDropMarketFixedPriceSale`, multiple merkle roots per sale are planned as a future feature. However, as a temporary solution, the possibility to at least replace the current one (e.g., where the seller has to provide the old one and the new one) could help in the described situations.

[](#info-07-undocumented-parameters)\[Info-07\] Undocumented parameters
-----------------------------------------------------------------------

In a two places, a parameter is missing in the documentation:

*   [NFTMarketExhibition](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketExhibition.sol#L84): `exhibitionId` within the event `NftRemovedFromExhibition`
*   [NFTMarketReserveAuction](https://github.com/f8n/fnd-contracts-staging/blob/c5ca7eb50e3fe3221bda49168cae8b4bbd98f4ac/contracts/mixins/nftMarket/NFTMarketReserveAuction.sol#L348): The parameter `referrer` of `placeBidV2` is not documented.

[](#gas-optimizations-1)Gas Optimizations (1)
=============================================

[](#g-01-nftmarketexhibitioncreateexhibition-unnecessary-storage-read)\[G-01\] `NFTMarketExhibition.createExhibition`: Unnecessary storage read
-----------------------------------------------------------------------------------------------------------------------------------------------

In line 138 of `NFTMarketExhibition`, instead of reading `idToExhibition[exhibitionId].curator`, `curator` can be set to `msg.sender`, resulting in the following reduction of gas usage when creating exhibitions:

    7,10c7,10
    <     108’739 - w/ 1
    <     132’430 - w/ 2
    <     203’497 - w/ 5
    <     1’269’704 - w/ 50
    ---
    >     108’924 - w/ 1
    >     132’615 - w/ 2
    >     203’682 - w/ 5
    >     1’269’889 - w/ 50
    50c50
    <     125’699 - createFixedPriceSaleWithEarlyAccessAllowlist
    ---
    >     125’711 - createFixedPriceSaleWithEarlyAccessAllowlist

[](#disclosures)Disclosures
===========================

C4 is an open organization governed by participants in the community.

C4 does not provide any guarantee or warranty regarding the security of this project. All smart contract software should be used at the sole risk and responsibility of users.

.grvsc-container { overflow: auto; position: relative; -webkit-overflow-scrolling: touch; padding-top: 1rem; padding-top: var(--grvsc-padding-top, var(--grvsc-padding-v, 1rem)); padding-bottom: 1rem; padding-bottom: var(--grvsc-padding-bottom, var(--grvsc-padding-v, 1rem)); border-radius: 8px; border-radius: var(--grvsc-border-radius, 8px); font-feature-settings: normal; line-height: 1.4; } .grvsc-code { display: table; } .grvsc-line { display: table-row; box-sizing: border-box; width: 100%; position: relative; } .grvsc-line > \* { position: relative; } .grvsc-gutter-pad { display: table-cell; padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } .grvsc-gutter { display: table-cell; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter::before { content: attr(data-content); } .grvsc-source { display: table-cell; padding-left: 1.5rem; padding-left: var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)); padding-right: 1.5rem; padding-right: var(--grvsc-padding-right, var(--grvsc-padding-h, 1.5rem)); } .grvsc-source:empty::after { content: ' '; -webkit-user-select: none; -moz-user-select: none; user-select: none; } .grvsc-gutter + .grvsc-source { padding-left: 0.75rem; padding-left: calc(var(--grvsc-padding-left, var(--grvsc-padding-h, 1.5rem)) / 2); } /\* Line transformer styles \*/ .grvsc-has-line-highlighting > .grvsc-code > .grvsc-line::before { content: ' '; position: absolute; width: 100%; } .grvsc-line-diff-add::before { background-color: var(--grvsc-line-diff-add-background-color, rgba(0, 255, 60, 0.2)); } .grvsc-line-diff-del::before { background-color: var(--grvsc-line-diff-del-background-color, rgba(255, 0, 20, 0.2)); } .grvsc-line-number { padding: 0 2px; text-align: right; opacity: 0.7; } .dark-default-dark { background-color: #1E1E1E; color: #D4D4D4; } .dark-default-dark .mtk1 { color: #D4D4D4; } .dark-default-dark .mtk15 { color: #C586C0; } .dark-default-dark .mtk12 { color: #9CDCFE; } .dark-default-dark .mtk7 { color: #B5CEA8; } .dark-default-dark .mtk3 { color: #6A9955; } .dark-default-dark .mtk11 { color: #DCDCAA; } .dark-default-dark .grvsc-line-highlighted::before { background-color: var(--grvsc-line-highlighted-background-color, rgba(255, 255, 255, 0.1)); box-shadow: inset var(--grvsc-line-highlighted-border-width, 4px) 0 0 0 var(--grvsc-line-highlighted-border-color, rgba(255, 255, 255, 0.5)); }