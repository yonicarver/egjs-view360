import {expect} from "chai";
import DeviceMotionInjector from "inject-loader!../../../src/YawPitchControl/input/DeviceMotion"; // eslint-disable-line import/no-duplicates
import ConstsInjector from "inject-loader!../../../src/YawPitchControl/consts";
import {window} from "../../../src/utils/browser";
import DeviceMotion from "../../../src/YawPitchControl/input/DeviceMotion"; // eslint-disable-line import/no-duplicates
import TestHelper from "./testHelper";

const getDeviceMotionWithUA = ua => {
	const ConstsWithUA = ConstsInjector({
		"../utils/browserFeature": {
			userAgent: ua
		}
	});

	return DeviceMotionInjector({
		"../consts": ConstsWithUA,
	}).default;
};

const MockedDeviceMotion = getDeviceMotionWithUA("Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-N910S Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Mobile Safari/537.36");

describe("DeviceMotion", () => {
	describe("#constructor", () => {
		it("Instance", () => {
			// Given
			// When
			const inst = new DeviceMotion();

			// Then
			expect(inst).to.be.exist;
		});
	});

	describe("DeviceMotion Test", () => {
		describe("devicemotion event fire Test", () => {
			let inst = null;
			let changed = false;

			beforeEach(() => {
				inst = new DeviceMotion();
				inst.on("devicemotion", e => {
					changed = true;
				});
			});

			afterEach(() => {
				inst && inst.disable();
				inst = null;
				changed = false;
			});

			it("should trigger devicemotion event", done => {
				// Given
				// When
				TestHelper.devicemotion(window, {
					acceleration: {x: 0, y: 0, z: 0},
					accelerationIncludingGravity: {x: 0, y: 0, z: 0},
					rotationRate: {alpha: 0, beta: 0, gamma: 0},
					interval: 1000 / 60,
				}, () => {
					// Then
					expect(changed).to.be.true;
					done();
				});
			});

			it("should trigger devicemotion event", done => {
				// Given
				// When
				TestHelper.devicemotion(window, {
					acceleration: {x: 0, y: 0, z: 0},
					accelerationIncludingGravity: {x: 0, y: 0, z: 0},
					rotationRate: {alpha: 0, beta: 0, gamma: 0},
					interval: 1000 / 60,
				}, () => {
					// Then
					expect(changed).to.be.true;
					done();
				});
			});

			it("should not trigger devicemotion event with empty sensor values.", done => {
				// Given
				// When
				TestHelper.devicemotion(window, {
					acceleration: {x: null, y: null, z: null},
					accelerationIncludingGravity: {x: null, y: null, z: null},
					rotationRate: {alpha: null, beta: null, gamma: null},
					interval: 1000 / 60,
				}, () => {
					// Then
					expect(changed).to.be.false;
					done();
				});
			});

			it("should not trigger change event when disable", done => {
				// Given
				// When
				inst.disable();
				TestHelper.devicemotion(window, {
					acceleration: {x: 0, y: 0, z: 0},
					accelerationIncludingGravity: {x: 0, y: 0, z: 0},
					rotationRate: {alpha: 0, beta: 0, gamma: 0},
					interval: 1000 / 60,
				}, () => {
					// Then
					expect(changed).to.be.false;
					done();
				});
			});
		});

		it("should trigger devicemotion event on android after calling enable()", done => {
			// Given
			let changed = false;
			const inst = new MockedDeviceMotion();

			inst.on("devicemotion", e => {
				changed = true;
			});
			inst.enable();

			// When
			TestHelper.devicemotion(window, {
				acceleration: {x: 0, y: 0, z: 0},
				accelerationIncludingGravity: {x: 0, y: 0, z: 0},
				rotationRate: {alpha: 0, beta: 0, gamma: 0},
				interval: 1000 / 60,
			}, () => {
				// Then
				expect(changed).to.be.true;
				inst.disable();
				done();
			});
		});

		it("should not trigger devicemotion event on android after calling disable()", done => {
			// Given
			let changed = false;
			const inst = new MockedDeviceMotion();

			inst.on("devicemotion", e => {
				changed = true;
			});
			inst.enable();
			inst.disable();

			// When
			TestHelper.devicemotion(window, {
				acceleration: {x: 0, y: 0, z: 0},
				accelerationIncludingGravity: {x: 0, y: 0, z: 0},
				rotationRate: {alpha: 0, beta: 0, gamma: 0},
				interval: 1000 / 60,
			}, () => {
				// Then
				expect(changed).to.be.false;
				done();
			});
		});

		it("should devicemotion event have properties that original event has", done => {
			// Given
			const inst = new DeviceMotion();
			let devicemotionEvent = null;

			inst.on("devicemotion", e => {
				devicemotionEvent = e.inputEvent;
			});

			// When
			TestHelper.devicemotion(window, {
				acceleration: {x: 0, y: 0, z: 0},
				accelerationIncludingGravity: {x: 0, y: 0, z: 0},
				rotationRate: {alpha: 0, beta: 0, gamma: 0},
				interval: 1000 / 60,
			}, () => {
				// Then
				expect(devicemotionEvent.acceleration).to.be.exist;
				expect(devicemotionEvent.accelerationIncludingGravity).to.be.exist;
				expect(devicemotionEvent.rotationRate).to.be.exist;
				expect(devicemotionEvent.interval).to.be.exist;
				done();
			});
		});

		it("devicemotion event should trigger once after enable method called twice", done => {
			// Given
			const inst = new DeviceMotion();
			let changeEventCnt = 0;

			inst.on("devicemotion", e => {
				changeEventCnt += 1;
			});
			// When
			inst.enable();
			inst.enable();
			TestHelper.devicemotion(window, {
				acceleration: {x: 0, y: 0, z: 0},
				accelerationIncludingGravity: {x: 0, y: 0, z: 0},
				rotationRate: {alpha: 0, beta: 0, gamma: 0},
				interval: 1000 / 60,
			}, () => {
				// Then
				expect(changeEventCnt).to.be.equal(1);
				done();
			});
		});
	});

	// 노트2 와 같이 뻉글뻉글 돌게 나와도 어느이상 안돌도록 해야함
});
