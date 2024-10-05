import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  return (
    <View style={{minHeight: 285}}>
        {/* <RichToolbar
            actions={[
                actions.setStrikethrough,
                actions.removeFormat,
                actions.setBold,
                actions.setItalic,
                actions.insertOrderedList,
                actions.blockquote,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.code,
                actions.line,
                actions.heading1,
                actions.heading4
            ]}
            style={styles.richBar}
            flatContainerStyle={styles.listStyle}
            editor={editorRef}
            disabled={false}
        />  */}
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({})