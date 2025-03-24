// ==UserScript==
// @name        Example
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @version     1.0.1
// @author      snomiao@gmail.com
// @description 12/28/2023, 8:50:50 PM
// @run-at      docment-start
// ==/UserScript==
//
// comments attached after banner
// SHOULD_INCLUDE_COMMENT_AFTER_BANNER
//


// some code


// comments in code
// SHOULD_NOT_INCLUDE_COMMENT_IN_CODE

// should bundle this import
import md5 from "md5";
console.log(md5("message"));
