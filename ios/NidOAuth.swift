//
//  NidOAuth.swift
//  moamoa
//
//  Created by 조수지 on 3/20/25.
//

import Foundation
import NaverThirdPartyLogin

@objc public class NidOAuth: NSObject {
    @objc public static let shared = NidOAuth()

    @objc public func initialize() {
        let instance = NaverThirdPartyLoginConnection.getSharedInstance()
        instance?.isNaverAppOauthEnable = true
        instance?.isInAppOauthEnable = true
        instance?.isOnlyPortraitSupportedInIphone()
        instance?.serviceUrlScheme = "com.csj1430.moamoa" // 너의 URL 스킴으로 맞춰줘
        instance?.consumerKey = "jXwhTHdVTq8o67R0hwKd" // 너의 클라이언트 ID
        instance?.consumerSecret = "0N1OGuLkjK" // 너의 클라이언트 Secret
        instance?.appName = "moamoa" // 앱 이름
    }
}
